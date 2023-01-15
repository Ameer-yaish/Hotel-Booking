const { getAllCities, getSeriesNames, getAllFeatures, getHotelsName, getHotelsAndSeries, getHotelInformation, getRoom, addNewRoomNumber, getPlace, getSeriesInformation, getOwnerInformation, addfeedbackNotification, getfeedbackNotification, getOwnerReservations, getOwnerMainPageInformation, deleteReservation, deleteUser, deleteHotel, updateHotel, deleteRoom, updateRoom, sendAcceptEmail } = require("../services/owner")
const { sendNotification } = require("../services/push-notification")
const upload = require("../middleware/upload")


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
 app.post('/sendAcceptEmail/',sendAcceptEmail)

 app.get('/feedbackNotification/',getfeedbackNotification)
 app.get('/reservations/',getOwnerReservations)
 app.get('/OwnerMainPageInformation/',getOwnerMainPageInformation)
 app.delete('/reservations/',deleteReservation)
 app.delete('/room',deleteRoom)

 app.delete('/hotel',deleteHotel)

 app.put('/hotel/:id',upload.array('imgs[]'),updateHotel)
 app.put('/room/:id',upload.array('imgs[]'),updateRoom)

 app.put('/NewRoomNumber/:id',addNewRoomNumber)
module.exports=app