var express = require('express')
var router = express.Router()
const {create, getall, getById , deleteU , addNiveau} = require('./batimentService')

router.post('/addBatiment',create)
router.get('/getall', getall)
router.get('/getbyid/:id', getById)
router.delete('/delete/:id',deleteU)
router.post('add', addNiveau)



module.exports = router