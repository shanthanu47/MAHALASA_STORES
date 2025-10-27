import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { importPincodesFromExcel } from './importPincodes.js';
import connectDB from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the .env file located in the server directory so MONGODB_URI and other
// server-specific env vars are available when this script runs from project root.
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const runImport = async () => {
    try {
        await connectDB();
        console.log('MongoDB connected...');
        console.log('Starting pincode import...');
        const result = await importPincodesFromExcel();
        console.log(`Import finished. Imported: ${result.imported}, Skipped: ${result.skipped}`);
        mongoose.connection.close();
    } catch (error) {
        console.error('Pincode import failed:', error);
        process.exit(1);
    }
};

runImport();
