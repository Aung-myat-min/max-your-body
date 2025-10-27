import {PrismaClient, Profile} from "@/generated/prisma";
import {ResponseHelper} from "@/lib/response.helper";

const prisma = new PrismaClient();

// GET PROFILE
export async function getProfile(userId: string): Promise<ResponseHelper<Profile| null>>{
    let response: ResponseHelper<Profile | null>;
    try {
        const profile = await prisma.profile.findUnique({where: {userId: userId},});
        if(profile){
            response = ResponseHelper.Success(profile, "Here is the profile.")
        }else{
            response = ResponseHelper.NotFound("Profile does not exist");
        }
    } catch (e) {
        console.error("Error getting profile: ",e);
        response = ResponseHelper.ServerErr("Error while getting profile");
    }
    return response
}

// CREATE PROFILE
export async function createProfile({userId, profileImg, weight, height}: Partial<Profile>): Promise<ResponseHelper<Profile| null>>{
    let response: ResponseHelper<Profile | null>;
    try {
        const profile = await prisma.profile.create({
            data: {
                profileImg: profileImg!,
                weight: weight!,
                height: height!,
                userId: userId!,
            }});

        response = ResponseHelper.Success(profile, "Here is the new profile!");
    } catch (e) {
        console.error("Error getting profile: ",e);
        response = ResponseHelper.ServerErr("Error while creating profile");
    }
    return response
}

// UPDATE PROFILE
export async function updateProfile({userId, profileImg, weight, height}: Partial<Profile>): Promise<ResponseHelper<Profile| null>>{
    let response: ResponseHelper<Profile | null>;
    try {
        const profile = await prisma.profile.update({
            where: {userId: userId},
            data: {
                profileImg: profileImg,
                weight: weight,
                height: height,
            }});

        response = ResponseHelper.Success(profile, "Here is the updated profile!");
    } catch (e) {
        console.error("Error getting profile: ",e);
        response = ResponseHelper.ServerErr("Error while updating profile");
    }
    return response
}

// DELETE PROFILE FEATURE doesn't exist because of the relation with the user column.

// UPLOAD USER PROFILE
// export async function (userId: string): Promise<ResponseHelper<Profile| null>>{
//     let response: ResponseHelper<Profile | null>;
//     try {
//
//     } catch (e) {
//         console.error("Error getting profile: ",e);
//         response = ResponseHelper.ServerErr("Error while getting profile");
//     }
//     return response
// }