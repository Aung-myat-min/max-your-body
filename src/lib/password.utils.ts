import * as bcrypt from 'bcryptjs';

const salt = 7;

export async function generateHash(password: string): Promise<string | null>{
    try{
        return await bcrypt.hash(password, salt)
    }catch (e){
        console.error("Error generating hash: ", e);
        return  null
    }
}
