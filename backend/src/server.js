import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';
import { spawn } from 'child_process';

// Import your models and services
import Application from './models/Application.js';
import authRoutes from './routes/auth.js';
import authMiddleware from './middleware/authMiddleware.js';
import { createProposalOnChain } from './services/aptosService.js';

const app = express();
const port = process.env.PORT || 3001;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- API Routes ---
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.send('API Running'));

app.get('/api/applications/shortlisted', async (req, res) => {
    try {
        const projects = await Application.find({ status: 'Pending Vote' });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch shortlisted projects.' });
    }
});

// This is the main route for submitting a new project
app.post('/api/applications', authMiddleware, (req, res) => {
    console.log('Received application:', req.body);
    const { title, description, applicantWallet, requestedAmount } = req.body;

    if (!title || !description || !applicantWallet || !requestedAmount) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // --- All Python script logic now lives INSIDE this route handler ---

    // 1. Start the Python script
    const pythonScriptPath = '../ai-engine/scripts/evaluate.py';
    const pythonProcess = spawn('python3', [pythonScriptPath]);

    // 2. Send data to the script
    pythonProcess.stdin.write(JSON.stringify({ title, description }));
    pythonProcess.stdin.end();

    let evaluationResult = '';
    pythonProcess.stdout.on('data', (data) => {
        evaluationResult += data.toString();
    });

    // 3. Listen for the script to finish
    pythonProcess.on('close', async (code) => {
        console.log(`Python script exited with code ${code}`);
        try {
            const evaluation = JSON.parse(evaluationResult);
            console.log('Evaluation Result:', evaluation);

            if (evaluation.passed_initial_screening) {
                const blockchainResult = await createProposalOnChain(
                    applicantWallet,
                    requestedAmount,
                    description
                );

                if (!blockchainResult.success) {
                    return res.status(500).json({ message: 'Failed to register proposal on-chain.' });
                }

                const newApplication = new Application({
                    title,
                    description,
                    applicantWallet,
                    requestedAmount,
                    status: 'Pending Vote',
                    aiEvaluation: evaluation,
                    onChainId: blockchainResult.onChainId,
                });
                
                await newApplication.save();

                res.status(201).json({
                    message: 'Application passed AI screening and is now pending vote!',
                    data: newApplication
                });

            } else {
                res.status(200).json({
                    message: 'Application did not pass initial AI screening.',
                    ai_evaluation: evaluation
                });
            }
        } catch (e) {
            console.error("Error processing application after AI evaluation:", e);
            res.status(500).json({ message: 'Error processing application.' });
        }
    });
});

app.get('/api/applications/by-applicant/:walletAddress', async (req, res) => {
    try {
        const { walletAddress } = req.params;
        const projects = await Application.find({ 
            applicantWallet: { $regex: new RegExp(`^${walletAddress}$`, 'i') }
        });
        res.json(projects);
    } catch (error) {
        console.error('Error fetching applicant projects:', error);
        res.status(500).json({ message: 'Failed to fetch applicant projects.' });
    }
});

// --- Start Server ---
app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});