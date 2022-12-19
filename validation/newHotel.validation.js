const joi =require("joi")


const schema ={
    body:joi.object({
        userId:joi.string().required(),
        name:joi.string().required()
      ,type:joi.string().required()
      ,desc:joi.string().required()
      ,destanceFromCityCenter:joi.string()
      ,city:joi.string()
      ,category:joi.string()
      ,address:joi.string()
     
       
    }) ,
    params:joi.object({
        id:joi.string()
    })
}

const method=['body','params']

module.exports.newHotelValidation=(req,res,next)=>{
    
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





