var express = require('express')
var router = express.Router()
const { list, create, update, deleteU,chat,searchByPrice} = require('./ordinateurService')

router.get('/list', list)
router.post('/create', create)
router.put('/update/:id', update)
router.delete('/delete/:id', deleteU)
router.get('/listByPrice',searchByPrice)
router.get('/search',chat);
module.exports = router