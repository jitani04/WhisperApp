// app/components/AudioRecorder.tsx
import { useState } from 'react';
import axios from 'axios';

const AudioRecorder: React.FC = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
    const [transcription, setTranscription] = useState('');

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);

        recorder.ondataavailable = (event) => {
            setAudioChunks((prevChunks) => [...prevChunks, event.data]);
        };

        recorder.start();
        setMediaRecorder(recorder);
        setIsRecording(true);
    };

    const stopRecording = async () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                const formData = new FormData();
                formData.append('audio_file', audioBlob, 'recording.webm');

                try {
                    const response = await axios.post('/api/transcribe', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                    setTranscription(response.data.transcription || 'Transcription failed.');
                } catch (error) {
                    console.error("Error transcribing audio:", error);
                }

                setAudioChunks([]);
                setIsRecording(false);
            };
        }
    };

    return (
        <div>
            <h1>Record and Transcribe Audio</h1>
            <button onClick={isRecording ? stopRecording : startRecording}>
                {isRecording ? "Stop Recording" : "Start Recording"}
            </button>
            {transcription && <pre>{transcription}</pre>}
        </div>
    );
};

export default AudioRecorder;
