const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {
  
  let customError={
    statusCode:err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg:err.message || "something went wrong"
  }  
  if(err.name==='ValidationError'){
    customError.msg=Obejct.values(err.errors).map((item)=>item.message).join(',');
    custom.statusCode=400;
  }
  if(err.code && err.code===11000){
    customError.msg=`This ${Object.keys(err.keyValue)} is already has an account.Try logging in...`
    customError.statusCode=400;
  }
  if (err.name === 'CastError') {
    customError.msg = `No item found with id : ${err.value}`
    customError.statusCode = 404
  }
  return res.status(customError.statusCode).json({ msg:customError.msg })
  
}

module.exports = errorHandlerMiddleware
