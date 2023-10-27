import { Request,Response,NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface PayLoad{
    sub:string;
}

export function isAuthenticated(

    req: Request,
    res: Response,
    next: NextFunction

){
    /*console.log("CHAMOU ESSE MIDDLEWARE");
    return next();*/
    //Primeiro receber o token
    const authToken = req.headers.authorization;

    if(!authToken){
        res.status(401).end();
    }

    //console.log(authToken);

    const [,token] = authToken.split(" ");

    //console.log(token);

    try{
        const {sub} = verify(
            token,
            process.env.JWT_SECRET
        )as PayLoad;

        //console.log (sub);

        return next();
    }catch(err){
        return res.status(401).end();
    }
}
