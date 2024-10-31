import { NextRequest, NextResponse } from 'next/server';
import formidable from 'formidable';
import { IncomingMessage } from 'http';

// Next.js requires you to use this for parsing FormData
export const config = {
    api: {
        bodyParser: false,
    },
};

const form = new formidable.IncomingForm();

export async function POST(req: NextRequest) {
    return new Promise((resolve, reject) => {
        const incomingRequest = req as unknown as IncomingMessage; // Cast NextRequest to IncomingMessage
        form.parse(incomingRequest, (err, fields, files) => {
            if (err) {
                reject(err);
                return;
            }
            // Assuming you have a file called 'audio_file'
            const audioFiles = files.audio_file as formidable.File[] | undefined; // Specify that it could be an array
            const audioFile = audioFiles ? (Array.isArray(audioFiles) ? audioFiles[0] : audioFiles) : null;

            if (!audioFile) {
                reject(new Error("No audio file uploaded."));
                return;
            }

            // Do something with the audioFile
            const transcription = "Transcription logic here"; // Replace with actual transcription logic

            resolve(NextResponse.json({ transcription }));
        });
    });
}
