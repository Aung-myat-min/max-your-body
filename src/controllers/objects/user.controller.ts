import {AUser, PrismaClient} from "@/generated/prisma";
import {ResponseHelper} from "@/lib/response.helper";
import {generateHash} from "@/lib/password.utils";
import {sendEmail} from "@/lib/email.utils";
import {generateVerificationCode, verifyCode} from "@/controllers/objects/verificationcode.controller";
import {randomString} from "@/lib/generate.utils";

const prisma = new PrismaClient();

// GET USER
export async function getUser(userId: string): Promise<ResponseHelper<AUser | null>> {
    let response: ResponseHelper<AUser | null>;
    try{
        const user = await prisma.aUser.findUnique({
            where: {
                userId: userId,
                isDeleted: false
            }
        });

        if(user == null){
            response = ResponseHelper.NotFound("User not found");
        }else{
            response = ResponseHelper.Success<AUser>(user, "Here is the user.")
        }
    }catch(err){
        console.error("Error getting user", err);
         response = ResponseHelper.ServerErr("An Error occurred while getting user");
    }
    return response;
}

// CREATE USER
export async function createUser({userName, userEmail, password, DOB}: Partial<AUser> ): Promise<ResponseHelper<AUser | null>> {
    let response: ResponseHelper<AUser | null>;
    try{
        const hashedPassword = await generateHash(password!);
        if(hashedPassword){
            const user = await prisma.aUser.create({
                data:{
                    userName: userName!,
                    userEmail: userEmail!,
                    password: hashedPassword,
                    DOB: DOB!
                }
            });

            if(user == null){
                response = ResponseHelper.Fail("User creation failed");
            }else{
                const verificationCode = await generateVerificationCode({email: userEmail!});
                await sendEmail({recipient: userEmail!, subject: "Your Verification Code", text: `Here is the verification code for your account creation: ${verificationCode}`});
                response = ResponseHelper.Success<AUser>(user, "Here is the new user.")
            }
        }else{
            response = ResponseHelper.Fail("User creation failed: Password encryption failed!");
        }
    }catch(err){
        console.error("Error creating user", err);
        response = ResponseHelper.ServerErr("An Error occurred while creating user");
    }
    return response;
}

// UPDATE USER
export async function updateUser({userId, userName, DOB}: Partial<AUser>): Promise<ResponseHelper<AUser | null>> {
    let response: ResponseHelper<AUser | null>;
    try{
        const user = await prisma.aUser.update({
            where: {
                userId: userId,
                isDeleted: false
            }, data: {
                userName: userName,
                DOB: DOB
            }
        });

        if(user == null){
            response = ResponseHelper.NotFound("User not found");
        }else{
            response = ResponseHelper.Success<AUser>(user, "Here is the user.")
        }
    }catch(err){
        console.error("Error updating user", err);
        response = ResponseHelper.ServerErr("An Error occurred while updating user");
    }
    return response;
}

// SEND USER UPDATE EMAIL
export async function sendUserEmailUpdate(userId: string, newEmail: string): Promise<ResponseHelper<AUser | null>> {
    let response: ResponseHelper<AUser | null>;
    try{
        const user = await prisma.aUser.findUnique({
            where: {
                userId: userId,
                isDeleted: false
            }
        });

        if(user == null){
            response = ResponseHelper.NotFound("User not found");
        }else{
            const verificationCode = await generateVerificationCode({email:newEmail});
            await sendEmail({recipient: newEmail, subject: "Email Changes Confirmation", text: `Your Verification Code for new email changes. /n ${verificationCode?.code}`})
            await sendEmail({recipient: user.userEmail, subject: "Email Changes Notification", text: `Your Email has been requested to change to ${newEmail}.`})
            response = ResponseHelper.Success<AUser>(user, "Verification Code sent to update the email.")
        }
    }catch(err){
        console.error("Error getting user", err);
        response = ResponseHelper.ServerErr("An Error occurred while getting user");
    }
    return response;
}

// UPDATE USER EMAIL
export async function updateUserEmail(userId: string, newEmail: string, code: string): Promise<ResponseHelper<AUser | null>> {
    let response: ResponseHelper<AUser | null>;
    try{
        let user = await prisma.aUser.findUnique({
            where: {
                userId: userId,
                isDeleted: false
            }
        });

        if(user == null){
            response = ResponseHelper.NotFound("User not found");
        }else{
            const codeCheck = await verifyCode({email: newEmail, code: code});
            if(codeCheck){
                user = await prisma.aUser.update({
                    where: {
                        userId: userId,
                        isDeleted: false
                    },
                    data: {
                        userEmail: newEmail
                    }
                })
                response = ResponseHelper.Success<AUser>(user, "User Email Updated!");
            }else{
                response = ResponseHelper.Fail("Code Checking Wrong!");
            }
        }
    }catch(err){
        console.error("Error getting user", err);
        response = ResponseHelper.ServerErr("An Error occurred while getting user");
    }
    return response;
}

// DELETE USER
export async function deleteUser(userId: string): Promise<ResponseHelper<null>> {
    let response: ResponseHelper<null>;
    try{
        const user = await prisma.aUser.findUnique({
            where: {
                userId: userId,
                isDeleted: false
            }
        });

        if(user == null){
            response = ResponseHelper.NotFound("User not found");
        }else{
            await prisma.aUser.update({
                where: {
                    userId: userId,
                }, data:{
                    userEmail: randomString(),
                    isDeleted: true
                }
            })
            response = ResponseHelper.Success(null,"User Deleted!");
        }
    }catch(err){
        console.error("Error getting user", err);
        response = ResponseHelper.ServerErr("An Error occurred while getting user");
    }
    return response;
}

// VERIFY USER
export async function verifyUser(userId: string, code: string): Promise<ResponseHelper<AUser | null>> {
    let response: ResponseHelper<AUser | null>;
    try{
        let user = await prisma.aUser.findUnique({
            where: {
                userId: userId,
                isDeleted: false
            }
        });

        if(user == null){
            response = ResponseHelper.NotFound("User not found");
        }else{
            const checkCode = await verifyCode({email: user.userEmail, code: code});
            if(checkCode){
                user = await prisma.aUser.update(
                    {
                        where: {
                            userId: userId,
                            isDeleted: false
                        },
                        data: {
                            verified: true
                        }
                    }
                )
                response = ResponseHelper.Success(user, "You have been verified!");
            }else{
                response = ResponseHelper.Fail("Code Checking Wrong!");
            }
        }
    }catch(err){
        console.error("Error getting user", err);
        response = ResponseHelper.ServerErr("An Error occurred while getting user");
    }
    return response;
}