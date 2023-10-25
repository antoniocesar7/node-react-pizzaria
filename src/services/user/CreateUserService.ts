import { hash } from "bcryptjs";
import prismaClient from "../../prisma";


interface UserRequest{
    name:string;
    email:string;
    password:string;
}

class CreateUserService{
    async execute({name,email,password}:UserRequest){
        
        //verificar se ele mandou o email
        if(!email){
            throw new Error("Email incorrect");
        }

        //verificar se o email está cadastrado na plataforma
        const userAlreadyExists = await prismaClient.user.findFirst({
            where:{
                email:email
            }
        })

        if(userAlreadyExists){
            throw new Error("User already Exists");
        }

        const passwordHash = await hash(password,8);

        const user = await prismaClient.user.create({
            data:{
                name:name,
                email:email,
                password:passwordHash
            },
            select:{
                id:true,
                email:true,
                name:true
            }
        });

        return user;
    }
}

export {CreateUserService};