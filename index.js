//Imports
import express from "express";
import { initWhisper } from "whisper-onnx-speech-to-text";

const whisper = await initWhisper("base.en");

const transcript = await whisper.transcribe("UserData/Audio/test.wav");
console.log(transcript);
console.log(transcript.chunks[10].timestamp);



const app = express()
const port = 3000;

//Middleware
app.use(express.static("public"));//Set up public folder for static files

//ENDPOINTS
//Root endpoint
app.get("/", (req, res) => {
    res.render("index.ejs");
})

//Start the app
app.listen(`${port}`, () => {
    console.log(`Server running on port ${port}`)
})