import {PrismaClient, VerificationCode} from "@/generated/prisma";

const prisma = new PrismaClient();
const durationInMs = 1000 * 60 * 60 * 5;

// Generate Verification Code
export async function generateVerificationCode({email}: {email: string}): Promise<VerificationCode | null>{
    try{
        const code = Math.floor(Math.random() * 1000000);

        const newCode = await prisma.verificationCode.create({
            data: {
            email: email,
                code: code.toString().padStart(6, '0'),
                duration: durationInMs
            }});

        console.log(`Generated Verification Code for ${email}, ${code.toString().padStart(6, '0')}`)
        return newCode
    }catch (e) {
        console.error("Error generating verification code: ", e);
        return null;
    }
}

// Validate Verification Code
export async function verifyCode({email, code}: {email: string, code: string}): Promise<boolean> {
    try{
        const validDateTimeRange = new Date(Date.now() - durationInMs);
        const latestCode = await prisma.verificationCode.findFirst({
            where: {
                email: email,
                isUsed: false,
                createdAt: {
                    gte: validDateTimeRange
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        if(!latestCode){
            console.log(`No valid verification code found for ${email}.`);
            return false;
        }

        if (latestCode.code === code) {
            await prisma.verificationCode.update(
                { where:
                        {
                            codeId: latestCode.codeId
                        },
                    data:
                        {
                            isUsed: true,
                            usedAt: new Date()
                        }
                }
            );
            return true;
        } else {
            return false;
        }
    }catch(e){
    console.error("Error verifying verification code: ", e);
    return false
    }
}