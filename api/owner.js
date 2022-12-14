const { getAllCities, getSeriesNames, getAllFeatures, getHotelsName, getHotelsAndSeries, getHotelInformation, getRoom, addNewRoomNumber, getPlace, getSeriesInformation, getOwnerInformation, addfeedbackNotification, getfeedbackNotification } = require("../services/owner")
const { sendNotification } = require("../services/push-notification")


const app=require("express").Router()


 app.get('/getAllCities',getAllCities)
 app.get('/getAllFeatures',getAllFeatures)
 app.get('/getSeriesNames/:id',getSeriesNames)
 app.get('/getHotelsName/:id',getHotelsName)
 app.get('/getHotelAndSeries/:id',getHotelsAndSeries)
 app.get('/getHotelInformation/:id',getHotelInformation)
 app.get('/getRoom/:id',getRoom)
 app.get('/getSeries/:id',getSeriesInformation)
 app.get('/getPlace/:id',getPlace)
 app.get('/getOwnerInformation/:id',getOwnerInformation)
 app.post('/notification/',sendNotification)
 app.post('/feedbackNotification/',addfeedbackNotification)
 app.get('/feedbackNotification/',getfeedbackNotification)

 app.put('/NewRoomNumber/:id',addNewRoomNumber)
module.exports=app