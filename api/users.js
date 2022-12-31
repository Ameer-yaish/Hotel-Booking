const upload = require("../middleware/upload")
const { register, login, newUser, updateUser, deleteUser, getUser, getUsers, verifyEmail, resetPassword, addUserCategories,getUserCategories, sendOTPVerificationEmail, addTopDestination, changePassword, getUserInformation, helpQuestionSearch,conversation, getUserConversations, newMessage, getMessages, updateFavouritePlaces, getFavouritePlaces, sendEmail, placePay, executePaymant, ownerRegister, savePayment, Roompay, RoomexecutePaymant } = require("../services/users")
const { verifyUser, verifyAdmin ,EmailIsVerified, verifyToken, verifyOTP} = require("../utils/verifyToken")
const { userValidation } = require("../validation/user.validation")
var paypal = require('paypal-rest-sdk');

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
app.put('/updateUser/:id',verifyToken,verifyUser,upload.array('imgs[]'),updateUser)

app.put('/changePassword',changePassword)
app.put('/addUserCategories/:id',addUserCategories)
app.put('/updatefavouritePlaces',updateFavouritePlaces)


app.get('/getUsers',verifyToken,verifyAdmin,getUsers)
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

app.get('/emailVerifiedPage',(req,res)=>{
    res.json("Email verified You Can Sign in now")
})
app.delete('/deleteUser/:id',verifyUser,deleteUser)
module.exports=app



