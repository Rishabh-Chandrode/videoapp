const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    videoTitle : String,
    videoName : String,
    videoUrl : String,
    subtitleName : String,
    subtitleUrl :String,
});

const Video = mongoose.model('Video', videoSchema);

module.exports = { Video };
