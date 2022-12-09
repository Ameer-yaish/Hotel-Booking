const mongoose=require('mongoose')


 const userSchema= mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    country:{
        type:String,
        required:true


    },
    img:{
        type:String,
        default:""

    },
    isVerified:{
        type:Boolean,

    },
    emailToken:{
        type:String,

    },
    city:{
        type:String,
        required:true


    },
    phone:{
        type:String,
        required:true


    },
  

    

    password:{
        type:String,
        required:true


    },
    resetVerified:{
        type:Boolean,
        default:false
       


    },
    categories:{
        type:[String],
        
    },
    
    isAdmin:{
        type:Boolean,
        default:false


    }


},{timestamps:true})

module.exports=mongoose.model('user',userSchema)