const express = require('express');
require('dotenv').config()
const app = express()
const { Video } = require('./models/models');

var admin = require("firebase-admin");
var serviceAccount = 
{
    "type": process.env.type ,
    "project_id": process.env.project_id,
    "private_key_id": process.env.private_key_id ,
    "private_key": process.env.private_key,
    "client_email": process.env.client_email ,
    "client_id": process.env.client_id ,
    "auth_uri": process.env.auth_uri ,
    "token_uri": process.env.token_uri ,
    "auth_provider_x509_cert_url": process.env.auth_provider_x509_cert_url ,
    "client_x509_cert_url": process.env.client_x509_cert_url ,
    "universe_domain":  process.env.universe_domain   
};


const mongoose = require('mongoose');

const cors = require("cors");
const bodyParser = require('body-parser');


const corsOptions = {
    origin: "*", // frontend URI (ReactJS)
}
app.use(cors(corsOptions)) // Use this after the variable declaration



const port = process.env.PORT || 8000


app.use(bodyParser.json());


const mongoURI = process.env.MONGO_URL;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage() })


//firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.BUCKET_URL
});
app.locals.bucket = admin.storage().bucket()


app.get('/', (req, res) => {
    res.send("working");
})


app.get('/allvideos', async (req, res) => {
    try {
        const documents = await Video.find();
        res.json(documents);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).send('Internal Server Error');
    }
})

app.post('/upload/videofile', upload.single('file'), async (req, res) => {

    try {
        // Set the destination path in the bucket
        const fileName = `videos/${req.file.originalname}`;
        const file = app.locals.bucket.file(fileName);
        // Create a write stream and upload the file
        const stream = file.createWriteStream();
        stream.end(req.file.buffer);
        // Wait for the upload to complete
        await new Promise((resolve, reject) => {
            stream.on('finish', resolve);
            stream.on('error', reject);
        });
        // Get the download URL for the uploaded file
        const [url] = await file.getSignedUrl({
            action: 'read',
            expires: '03-17-2025', // Set the expiration date for the URL
        });
        // Send the download URL in the response
        // res.json({ downloadUrl: url });
        const video = new Video({
            videoTitle: req.file.originalname,
            videoUrl: url,
            subtitleName: "NA",
            subtitleUrl: "NA"
        });

        const savedVideo = await video.save();

        // Send the download URL and document ID in the response
        res.json({
            downloadUrl: url,
            documentId: savedVideo._id,
            fileName: req.file.originalname,
        });

    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).send('Internal Server Error');
    }

})


//upload subtitles
app.post('/upload/subtitlefile', async (req, res) => {
    try {
        const { docId, subtitles } = req.body;

        // Ensure docId and subtitles are provided
        if (!docId || !subtitles || !Array.isArray(subtitles)) {
            return res.status(400).json({ error: 'Invalid request format' });
        }

        // Convert subtitles to SRT format
        const srtContent = subtitles
            .map((subtitle, index) => {
                const startTime = formatTime(subtitle.startTime);
                const endTime = formatTime(subtitle.endTime);
                return `${index + 1}\n${startTime} --> ${endTime}\n${subtitle.text}\n\n`;
            })
            .join('');

        const srtBuffer = Buffer.from(srtContent, 'utf-8');
        const filePath = `subtitles/${docId}.srt`;
        const file = app.locals.bucket.file(filePath);
        await file.save(srtBuffer, {
            metadata: {
                contentType: 'text/plain',
            },
        });
        const [url] = await file.getSignedUrl({
            action: 'read',
            expires: '03-17-2025', // Set the expiration date for the URL
        });

        await Video.findOneAndUpdate(
            { _id: docId },
            { $set: { subtitleUrl: url, subtitleName: `${docId}.srt` } },
        );
        console.log(typeof url , typeof docId);
        res.json({downloadUrl:url,docId});
    } catch (error) {
        console.error('Error converting and storing subtitles:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

function convertToSRT(subtitles) {
    let srtContent = '';

    subtitles.forEach((subtitle, index) => {
        srtContent += `${index + 1}\n`;
        srtContent += `${formatTime(subtitle.startTime)} --> ${formatTime(subtitle.endTime)}\n`;
        srtContent += `${subtitle.text}\n\n`;
    });

    return srtContent;
}

// Function to format time in HH:mm:ss,SSS format
function formatTime(seconds) {
    const date = new Date(seconds * 1000);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const secondsFormatted = date.getSeconds();
    const milliseconds = date.getMilliseconds();

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secondsFormatted).padStart(2, '0')},${String(milliseconds).padStart(3, '0')}`;
}











//fetch subtitles
app.get('/fetchsubtitle', async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) {
            return res.status(400).json({ error: 'ID is required in the query parameters' });
        }
        // Find the corresponding document in MongoDB
        const document = await Video.findOne({ _id: id });
        if (!document) {
            return res.status(404).json({ error: 'Document not found for the provided ID' });
        }
        const downloadUrl = document.subtitleUrl;
        if (!downloadUrl) {
            return res.status(400).json({ error: 'Subtitle URL not found in the document' });
        }
        // Extract the file name from the download URL
        const fileName = document.subtitleName;
        //Get the file from Firebase Storage
        const file = app.locals.bucket.file(`subtitles/${fileName}`);
        // Download the file content
        const fileContent = await file.download();
        const filebuffer = fileContent[0];
        const fileContentString = fileContent[0].toString('utf-8');


        const jsonstr = srtStringToJson(fileContentString);
        // Convert the file content to an array (modify as needed based on your file format)
        res.send(jsonstr);

    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
//fetch subtitle helper function
function srtStringToJson(srtString) {
    const subtitleEntries = srtString.trim().split('\n\n');

    const subtitlesArray = subtitleEntries.map((entry) => {
        const lines = entry.split('\n');

        const index = parseInt(lines[0]);
        const [startTime, endTime] = lines[1].split(' --> ');
        const text = lines.slice(2).join('\n');

        return {
            index,
            startTime,
            endTime,
            text,
        };
    });

    return subtitlesArray;
}




app.listen(port, (req, res) => {
    console.info(`Running on ${port}`)
})





