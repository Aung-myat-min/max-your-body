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
// UPDATE PROFILE
// DELETE PROFILE
// UPLOAD USER PROFILE