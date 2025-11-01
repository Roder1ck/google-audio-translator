const vosk = require('vosk');
const mic = require('mic');

const MODEL_PATH = "model/vosk-model-small-en-us-0.15";
const SAMPLE_RATE = 16000;

vosk.setLogLevel(0);
const model = new vosk.Model(MODEL_PATH);
const rec = new vosk.Recognizer({ model: model, sampleRate: SAMPLE_RATE });

const micInstance = mic({
  rate: String(SAMPLE_RATE),
  channels: '1',
  debug: false,
  exitOnSilence: 6
});

const micInputStream = micInstance.getAudioStream();

micInputStream.on('data', (data) => {
  if (rec.acceptWaveform(data)) {
    const result = rec.result();
    if (result.text) console.log('🗣️', result.text);
  }
});

micInputStream.on('error', (err) => {
  console.error('Mic error:', err);
});

micInputStream.on('silence', () => {
  const final = rec.finalResult();
  if (final.text) console.log('🛑 Final:', final.text);
});

micInstance.start();
console.log('🎤 Listening... Speak into the mic');