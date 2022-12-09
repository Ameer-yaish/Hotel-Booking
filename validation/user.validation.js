const joi =require("joi")


const schema ={
    body:joi.object({
      email:joi.string().email().required()
      ,username:joi.string().min(3).max(15).required()
      ,password:joi.string().min(3).max(10).required()
      ,repassword:joi.ref("password"),
      phone:joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}).required()
      ,city:joi.string(),
      country:joi.string(),
       
    }) ,
    params:joi.object({
        id:joi.string()
    })
}

const method=['body','params']

module.exports.userValidation=(req,res,next)=>{
    const errArray=[]
method.map((key)=>{
    const {error}=schema[key].validate(req[key],{abortEarly:false})
    if(error){
        error.details.map((msg)=>{
            errArray.push(msg.message)

        })
    }
   
})
if(errArray.length==0){
    next()
}
else {
    res.json({message:errArray})
}
   

}