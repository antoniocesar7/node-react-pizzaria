import prismaClient from "../../prisma";
import { compare } from "bcryptjs";
import {sign} from "jsonwebtoken";


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
        //Se deu tudo certo vamos gerar o tokent pro usuário
        const token = sign({
            name:   user.name,
            email:  user.email
        },
        process.env.JWT_SECRET,
        {
            subject:user.id,
            expiresIn:'30d'
        }
        )
        
        return {
            id:user.id,
            name:user.name,
            email:user.email,
            token: token
        }
    }
}

export {AuthUserService};