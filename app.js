const express = require('express')
const mongoose=require('mongoose')
const app = express()
const port = 3000
mongoose.connect("mongodb+srv://ameer:ameer123@cluster0.4urwsng.mongodb.net/booking")
app.use(express.json())
const cookieParser = require('cookie-parser')
app.use(cookieParser())
app.use('/api/hotels',require('./api/hotels'))
app.use('/api/users',require('./api/users'))
app.use('/api/rooms',require('./api/rooms'))
app.use('/api/admin',require('./api/admin'))


app.use('/uploads',express.static('uploads'))
app.use((err,req,res,next)=>{
    const errorStatus=err.status || 500
    const errorMessage=err.message || 'something went wrong'
    return res.status(errorStatus).json({
        success:false,
        status:errorStatus,
        message:errorMessage,
        stack:err.stack
    })

})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

