const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cookSchema = new Schema({
  firstName : { type: String, required: true },
  lastName : { type: String, required: true },
  recipes: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }],
}, {collection : 'cooks'});

const Cook = mongoose.model('Cook', cookSchema);
module.exports = Cook;