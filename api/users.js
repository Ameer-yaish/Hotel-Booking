const upload = require("../middleware/upload")
const { register, login, newUser, updateUser, deleteUser, getUser, getUsers, verifyEmail, resetPassword, addUserCategories,getUserCategories, sendOTPVerificationEmail, addTopDestination, changePassword, getUserInformation, helpQuestionSearch,conversation, getUserConversations, newMessage, getMessages } = require("../services/users")
const { verifyUser, verifyAdmin ,EmailIsVerified, verifyToken, verifyOTP} = require("../utils/verifyToken")
const { userValidation } = require("../validation/user.validation")

const app=require("express").Router()




app.post('/auth/register',userValidation,register)
app.post('/auth/login',EmailIsVerified,login)
app.post('/messages',newMessage)
app.get('/messages/:conversationId',getMessages)

app.post('/conversation',conversation)
app.get('/conversations/:userId',getUserConversations)

app.put('/sendOTPVerificationEmail',sendOTPVerificationEmail)
app.put('/resetPassword',verifyOTP,resetPassword)
app.put('/updateUser/:id',verifyToken,verifyUser,upload.array('imgs[]'),updateUser)

app.put('/changePassword',changePassword)
app.put('/addUserCategories/:id',addUserCategories)
app.delete('/deleteUser/:id',verifyUser,deleteUser)

app.get('/getUsers',verifyToken,verifyAdmin,getUsers)
app.get('/verify-email',verifyEmail)
app.get('/getUserCategories/:id',verifyToken,verifyUser,getUserCategories)
app.post('/addTopDestination',upload.array('imgs[]'),addTopDestination)
app.get('/getUserInformation/:id',verifyToken,verifyUser,getUserInformation)
app.get('/helpQuestionSearch',helpQuestionSearch)

app.get('/emailVerifiedPage',(req,res)=>{
    res.json("Email verified You Can Sign in now")
})
module.exports=app



