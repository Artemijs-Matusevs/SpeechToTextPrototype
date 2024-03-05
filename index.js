//Imports
import express from "express";
import { initWhisper } from "whisper-onnx-speech-to-text";
import multer from "multer";
import ffmpeg from "fluent-ffmpeg";

const whisper = await initWhisper("base.en");


const app = express()
const port = 3000;

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.').pop());
    }
});

const upload = multer({ storage: storage});

//Middleware
app.use(express.static("public"));//Set up public folder for static files

//ENDPOINTS
//Root endpoint
app.get("/", (req, res) => {
    res.render("index.ejs");
})

//Route to upload video
app.post("/upload", upload.single('video'), async function (req, res) {
    if (!req.file) {
        return res.status(400).send("No files were uploaded.");
    }

    //Define input and output paths
    const inputVideoPath = req.file.path;
    const outputAudioPath = 'uploads/' + req.file.filename.split('.')[0] + 'wav';

    try {
        await convertVideoToWav(inputVideoPath, outputAudioPath);
        const transcript = await whisper.transcribe(outputAudioPath);
        res.render("index.ejs", { text: transcript.chunks })
    } catch (error) {
        res.status(500).send('Error during conversion');
    }
})


//Start the app
app.listen(`${port}`, () => {
    console.log(`Server running on port ${port}`)
})



//Function to convert video to .wav
function convertVideoToWav(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .output(outputPath)
            .withAudioCodec('pcm_s16le')
            .audioFrequency(44100)
            .audioChannels(2)
            .toFormat('wav')
            .on('end', () => {
                console.log('Conversion finished ')
                resolve(outputPath);
            })
            .on('error', (err) => {
                console.error('Error:', err);
                reject(err);
            })
            .run();
    });
}