const upload = require("../middleware/upload")
const { register, login, newUser, updateUser, deleteUser, getUser, getUsers, verifyEmail, resetPassword, addUserCategories,getUserCategories, sendOTPVerificationEmail, addTopDestination, changePassword, getUserInformation, helpQuestionSearch,conversation, getUserConversations, newMessage, getMessages, updateFavouritePlaces, getFavouritePlaces, sendEmail, placePay, executePaymant, ownerRegister, savePayment, Roompay, RoomexecutePaymant, addAutoSearchCoordinates, getNearestPlaces, addUserLocation, getUserLocation } = require("../services/users")
const { verifyUser, verifyAdmin ,EmailIsVerified, verifyToken, verifyOTP} = require("../utils/verifyToken")
const { userValidation } = require("../validation/user.validation")
var paypal = require('paypal-rest-sdk');
var messageModel = require('../models/message');

const app=require("express").Router()




app.post('/auth/register',userValidation,register)
app.post('/auth/owner/register',userValidation,ownerRegister)
app.post('/auth/login',EmailIsVerified,login)
app.post('/messages',newMessage)
app.post('/sendEmail',sendEmail)


app.post('/addTopDestination',upload.array('imgs[]'),addTopDestination)


app.post('/conversation',conversation)
app.get('/conversations/:userId',getUserConversations)

app.put('/sendOTPVerificationEmail',sendOTPVerificationEmail)
app.put('/resetPassword',verifyOTP,resetPassword)
app.put('/updateUser/:id',upload.array('imgs[]'),updateUser)

app.put('/changePassword',changePassword)
app.put('/addUserCategories/:id',addUserCategories)
app.put('/updatefavouritePlaces',updateFavouritePlaces)

// app.get('/getUsers',verifyToken,verifyAdmin,getUsers)
app.get('/getUsers',getUsers)
app.get('/verify-email',verifyEmail)
app.get('/getUserCategories/:id',verifyToken,verifyUser,getUserCategories)
app.get('/getfavouritePlaces/:id',getFavouritePlaces)
app.get('/getUserInformation/:id',verifyToken,verifyUser,getUserInformation)
app.get('/helpQuestionSearch',helpQuestionSearch)
app.get('/messages/:conversationId',getMessages)

app.get('/placePay',placePay)
app.get('/success',executePaymant)



app.get('/Roompay',Roompay)
app.get('/savePayment',savePayment)
app.get('/RoomexecutePaymant',RoomexecutePaymant)
app.get('/nearestPlaces',getNearestPlaces)
app.get('/userLocation/:id',getUserLocation)

app.put('/coordinates',addAutoSearchCoordinates)
app.put('/userLocation',addUserLocation)

app.get('/emailVerifiedPage',(req,res)=>{
    res.send(`
    <html>
        <head>
            <title>Email verified You Can Sign in now</title>
            <style>
                body {
                    background-color: #F5F5F5;
                    font-family: Arial, sans-serif;
                }
                .container {
                    width: 80%;
                    margin: 0 auto;
                    text-align: center;
                }
                h1 {
                    color: #00A859;
                    margin-top: 100px;
                }
                p {
                    font-size: 20px;
                    margin-top: 50px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Email verified You Can Sign in now</h1>
                <p>Thank you for your Regiestration!</p>
            </div>
        </body>
    </html>
`);
})

app.get('/paymentSuccess', function (req, res) {
    res.send(`
        <html>
            <head>
                <title>Payment Success</title>
                <style>
                    body {
                        background-color: #F5F5F5;
                        font-family: Arial, sans-serif;
                    }
                    .container {
                        width: 80%;
                        margin: 0 auto;
                        text-align: center;
                    }
                    h1 {
                        color: #00A859;
                        margin-top: 100px;
                    }
                    p {
                        font-size: 20px;
                        margin-top: 50px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Payment Success</h1>
                    <p>Thank you for your payment!</p>
                </div>
            </body>
        </html>
    `);
});

app.delete('/deleteUser/:id',verifyUser,deleteUser)




app.post('/photo',upload.array('imgs[]'),(req,res)=>{
    
    const{name,...other}=req.body
    console.log(other)
    const photo=new messageModel({
      ...req.body
     })
 

   
      if(req.files){
          let path=''
          req.files.forEach(function(files,index,arr){
              path=path+files.path+','
          })
          path=path.substring(0,path.lastIndexOf(","))
          photo.imgs=path
      }     
  
      photo.save()
      res.json({reqFiles:req.files,reqBody:req.body})
})

module.exports=app



