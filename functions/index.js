/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// POST endpoint to handle incoming data
app.post('/bfhl', (req, res) => {
    const { data, file_b64 } = req.body;

    // Initializing response object
    let response = {
        user_id: "john_doe_17091999", // Example user ID format
        is_success: true,
        numbers: [],
        alphabets: [],
        highest_lowercase_alphabet: [],
        file_valid: false,
        file_mime_type: "",
        file_size_kb: "0"
    };

    // Validate the incoming data
    if (!Array.isArray(data)) {
        return res.status(400).json({ is_success: false, message: "Invalid data format" });
    }

    // Processing input data
    data.forEach(item => {
        if (!isNaN(item)) {
            response.numbers.push(item);
        } else if (/^[a-zA-Z]$/.test(item)) {
            response.alphabets.push(item);
        }
    });

    // Find the highest lowercase alphabet
    const lowercaseAlphabets = response.alphabets.filter(char => char === char.toLowerCase());
    if (lowercaseAlphabets.length > 0) {
        const highestLowercase = lowercaseAlphabets.sort().pop(); // Get the last in sorted order
        response.highest_lowercase_alphabet.push(highestLowercase);
    }

    // File handling
    if (file_b64) {
        // Example logic for base64 validation (you may want to refine this)
        const fileBuffer = Buffer.from(file_b64, 'base64');
        if (fileBuffer) {
            response.file_valid = true;
            response.file_size_kb = (fileBuffer.length / 1024).toFixed(2);
            // Determine MIME type (basic example, refine as needed)
            response.file_mime_type = 'application/octet-stream'; // Change this based on your needs
        }
    }

    // Responding with the constructed response object
    res.status(200).json(response);
});

// GET endpoint to return a fixed operation code
app.get('/bfhl', (req, res) => {
    res.status(200).json({ operation_code: 1 });
});

// Export the Express app as a Firebase Cloud Function
exports.api = functions.https.onRequest(app);
