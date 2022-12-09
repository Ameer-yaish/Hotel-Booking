const upload = require("../middleware/upload")
const { addCategories, addHotelType, addCity, addHelpTopic, addHelpQuestion, getHelpTopics, getHelpQuestions } = require("../services/admin")
const { verifyToken, verifyAdmin } = require("../utils/verifyToken")

const app=require("express").Router()

app.post('/addCategory',upload.array('imgs[]'),addCategories)
app.post('/addHotelType',upload.array('imgs[]'),addHotelType)
app.post('/addCity',upload.array('imgs[]'),addCity)
app.post('/addHelpTopic',addHelpTopic)
app.put('/addHelpQuestion',addHelpQuestion)
app.get('/getHelpTopics',getHelpTopics)
app.get('/getHelpQuestions',getHelpQuestions)
module.exports=app