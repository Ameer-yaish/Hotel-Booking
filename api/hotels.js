const { newHotel, updateHotel, deleteHotel, getHotel, getHotels, countByCity, countByType, featuredHotels, searchHotels, getHotelRooms, addHotelType, getHotelTypes, getCities, getCategories } = require("../services/hotels")
const { verifyAdmin, verifyToken } = require("../utils/verifyToken")

const app=require("express").Router()
const upload = require("../middleware/upload")
const { newHotelValidation } = require("../validation/newHotel.validation")






app.post('/newHotel',upload.array('imgs[]'),newHotelValidation,newHotel)

app.put('/updateHotel/:id',verifyToken,verifyAdmin,updateHotel)
app.delete('/deleteHotel/:id',verifyToken,verifyAdmin,deleteHotel)
app.get('/getHotel/:id',getHotel)
app.get('/getHotels',getHotels)


app.get('/countByCity',countByCity)
app.get('/countByType',countByType)
app.get('/featuredHotels',featuredHotels)
app.get('/searchHotels',searchHotels)
app.get('/getHotelRooms/:id',getHotelRooms)
app.get('/getHotelTypes',getHotelTypes)
app.get('/getCities',getCities)
app.get('/getCategories',getCategories)

module.exports=app