const Job= require('../models/Job');
const {StatusCodes}=require('http-status-codes');
const {BadRequestError,UnauthenticatedError,NotFoundError}=require('../errors/index');
const getAllJobs=async (req,res)=>{
    const jobs=await Job.find({createdBy:req.user.userId}).sort('createdAt');

    res.status(StatusCodes.OK).json({jobs,count:jobs.length});
}
const createJob=async (req,res)=>{
    req.body.createdBy=req.user.userId;
    //console.log(req.user);
    const job=await Job.create(req.body); 
    res.status(StatusCodes.CREATED).send({job});

}
const getJob=async (req,res)=>{
    const jobId=req.params.id;
    const userId=req.user.userId;
    const job=await Job.findOne({_id:jobId,createdBy:userId})
    //console.log(job);
    if(!job){
        throw new NotFoundError('No job found');
    }
    res.status(StatusCodes.OK).json({job});
}
const updateJob=async (req,res)=>{
    const {company,position}=req.body;
    const userId=req.user.userId;
    const jobId=req.params.id;
    if(company==='' || position===''){
        throw new BadRequestError('PLease provide comapny and position');
    }
    const job=await Job.findOneAndUpdate({_id:jobId,createdBy:userId},req.body,{new:true,
    runValidators:true});
    if(!job){
        throw new NotFoundError('No job found');
    }
    res.status(StatusCodes.OK).json({job});
}
const deleteJob=async (req,res)=>{
    const {company,position}=req.body;
    const userId=req.user.userId;
    const jobId=req.params.id;
    if(company==='' || position===''){
        throw new BadRequestError('PLease provide comapny and position');
    }
    const job=await Job.findOneAndDelete({_id:jobId,createdBy:userId});
    if(!job){
        throw new NotFoundError('No job found');
    }
    res.status(StatusCodes.OK).json({job});
}

module.exports={
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}