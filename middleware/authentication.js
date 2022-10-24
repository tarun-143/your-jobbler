const jwt=require('jsonwebtoken');
require('dotenv').config();
const { UnauthenticatedError } = require('../errors/index');
const auth= (req,res,next)=>{
    const authHeader=req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new UnauthenticatedError('Authentication invalid');
    }
    try{
        
        const token =authHeader.split(' ')[1];
        //console.log(process.env.JWT_SECRET);
        const payload=jwt.verify(token,process.env.JWT_SECRET);
        //console.log(payload);
        req.user={userId:payload.userId,name:payload.name}
        next();
    }
   catch(err){
    console.log(err)
    throw new UnauthenticatedError('Invalid Auth');
   }
}
module.exports=auth;