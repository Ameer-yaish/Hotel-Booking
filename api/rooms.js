
const upload = require("../middleware/upload")
const { createRoom, updateRoom, deleteRoom, getRoom, getRooms, updateRoomAvailability, getRoomsByType, getCity, topRating, topBooking, getDataForFilter, addFeedback, roomsFilter, roomSearch } = require("../services/rooms")
const { verifyAdmin, verifyToken } = require("../utils/verifyToken")

const app=require("express").Router()






app.post('/newRoom/:hotelid',upload.array('imgs[]'),createRoom)
app.put('/updateRoom/:id',verifyToken,verifyAdmin,updateRoom)
app.delete('/deleteRoom/:id/:hotelid',verifyToken,verifyAdmin,deleteRoom)
app.get('/getRoom/:id',getRoom)
app.get('/getRoomsByType',getRoomsByType)
app.get('/getCity/:id',getCity)
app.get('/topRating',topRating)
app.get('/topBooking',topBooking)
app.put('/availability/:id',updateRoomAvailability)
app.get('/getDataForFilter',getDataForFilter)
app.put('/Feedback/:id',addFeedback)
app.get('/roomsFilter',roomsFilter)
app.get('/roomSearch',roomSearch)


module.exports=app