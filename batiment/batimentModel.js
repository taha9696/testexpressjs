var mongoose = require('mongoose')
var Schema = mongoose.Schema
var Batiment = new Schema({
    nom : String,
    nbr_niveau : Number,
    description : String,
    adress : String,
    niveaux: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Niveau' }],
})
module.exports = mongoose.model('batiments', Batiment)