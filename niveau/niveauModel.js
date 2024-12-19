var mongoose = require('mongoose');
const { boolean } = require('yup');
var Schema = mongoose.Schema;

var Niveau = new Schema({
    etat_construction: Boolean,
  batiment: { type: mongoose.Schema.Types.ObjectId, ref: 'Batiment' }
});

module.exports = mongoose.model('niveau', Niveau);