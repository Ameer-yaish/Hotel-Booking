const upload = require("../middleware/upload")
const { addCategories, addHotelType,getAllCities, addCity, addHelpTopic, addHelpQuestion, getHelpTopics, getHelpQuestions, addFeature, getUsersCount, getUsersAndOwners, makeOwner, deleteCategory, getHotelTypes, deleteHotelType, deleteCity, deleteFeature, deletehelpTopic, getHelpTopicQuestions, getTopDestination } = require("../services/admin")
const { verifyToken, verifyAdmin } = require("../utils/verifyToken")

const app=require("express").Router()

app.post('/addCategory',upload.array('imgs[]'),addCategories)
app.post('/addHotelType',upload.array('imgs[]'),addHotelType)
app.post('/addCity',upload.array('imgs[]'),addCity)
app.post('/addHelpTopic',addHelpTopic)
app.post('/addFeature',addFeature)

app.put('/addHelpQuestion',addHelpQuestion)
app.put('/makeOwner/:id',makeOwner)
app.get('/getHelpTopics',getHelpTopics)
app.get('/getHelpQuestions',getHelpQuestions)
app.get('/usersCount',getUsersCount)
app.get('/UsersAndOwners',getUsersAndOwners)
app.get('/types',getHotelTypes)
app.get('/city',getAllCities)
app.get('/helpTopicQuestions/:id',getHelpTopicQuestions)
app.get('/topDestination',getTopDestination)

app.delete('/hotelType/:id',deleteHotelType)
app.delete('/city/:id',deleteCity)
app.delete('/feature/:id',deleteFeature)
app.delete('/helpTopic/:id',deletehelpTopic)
app.delete('/question',deletehelpTopic)
app.delete('/Categories/:id',deleteCategory)

module.exports=app