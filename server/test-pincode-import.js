import 'dotenv/config';
import connectDB from './configs/db.js';
import { importPincodesFromExcel } from './configs/importPincodes.js';

// Test script to import pincode data
const testImport = async () => {
    try {
        await connectDB();
        console.log('Connected to database');

        console.log('Starting pincode import...');
        const result = await importPincodesFromExcel();

        console.log('Import completed successfully!');
        console.log(`Imported: ${result.imported} pincodes`);
        console.log(`Skipped: ${result.skipped} pincodes`);

        process.exit(0);
    } catch (error) {
        console.error('Import failed:', error);
        process.exit(1);
    }
};

testImport();