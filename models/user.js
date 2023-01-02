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
    wantToBeOwner:{
        type:Boolean,
        default:false


    },
    isOwner:{
        type:Boolean,
        default:false


    },

    isAdmin:{
        type:Boolean,
        default:false


    },
    favouritePlaces:{
        type:[mongoose.SchemaTypes.ObjectId],
        default:[]

    },
    address:{
        type:{longitude:Number,latitude:Number}
    },
    userLocation:{
        type:{longitude:Number,latitude:Number}
    }


},{timestamps:true})

module.exports=mongoose.model('user',userSchema)