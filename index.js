//Imports
import express from "express";
import { initWhisper } from "whisper-onnx-speech-to-text";
import multer from "multer";

/*const whisper = await initWhisper("base.en");

const transcript = await whisper.transcribe("UserData/Audio/test.wav");
console.log(transcript);
console.log(transcript.chunks[10].timestamp);*/


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
app.post("/upload", upload.single('video'), function (req, res) {
    if (!req.file) {
        return res.status(400).send("No files were uploaded.");
    }

    res.send('File uploaded!');
})


//Start the app
app.listen(`${port}`, () => {
    console.log(`Server running on port ${port}`)
})