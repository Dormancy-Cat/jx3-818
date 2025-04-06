const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StorySchema = new Schema({
  characterId: { type: String, required: true },
  characterUid: { type: String, required: false },
  server: { type: String, required: true },
  school: { type: String, required: true },
  title: { type: String, required: true },
  summary: { type: String, required: true },
  timeline: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Story', StorySchema); 