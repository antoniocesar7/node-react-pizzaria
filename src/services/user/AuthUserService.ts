import { compare } from "bcryptjs";
import prismaClient from "../../prisma";


interface AuthRequest{
    email:string;
    password:string;
}

class AuthUserService{
    async execute({email,password}:AuthRequest){
        //console.log(email);
        //verificar se o email existe
        const user = await prismaClient.user.findFirst({
            where:{
                email:email 
            }
        })

        if(!user){
            throw new Error("User/password not found");
        }

        //verificar senha no banco mesmo estando criptografado
        const passwordMatch = await compare(password,user.password);

        if(!passwordMatch){
            throw new Error("User/password incorrect");
        }

        //gerar um token JWT e devolver os dados do usuário como id, name e email

        return {ok: true}
    }
}

export {AuthUserService};