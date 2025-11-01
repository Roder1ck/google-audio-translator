const fs = require('fs');
const vosk = require('vosk');
const wav = require('wav');

const MODEL_PATH = "model/vosk-model-small-en-us-0.15";
const SAMPLE_RATE = 16000;

vosk.setLogLevel(0);
const model = new vosk.Model(MODEL_PATH);
const rec = new vosk.Recognizer({ model: model, sampleRate: SAMPLE_RATE });

const wfReader = new wav.Reader();
wfReader.on("format", () => {
  wfReader.on("data", (data) => rec.acceptWaveform(data));
  wfReader.on("end", () => {
    console.log("Transcription:", rec.finalResult().text);
    rec.free();
    model.free();
  });
});

fs.createReadStream("input.wav").pipe(wfReader);