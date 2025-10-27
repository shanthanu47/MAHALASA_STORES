import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';
import Pincode from '../models/Pincode.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const importPincodesFromExcel = async () => {
    try {
        // Path to the Excel file (assuming it's in the root directory)
        const excelFilePath = path.join(__dirname, '../../pincode.xlsx');

        // Read the Excel file
        const workbook = XLSX.readFile(excelFilePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        console.log(`Found ${jsonData.length} pincode entries to import`);

        let imported = 0;
        let skipped = 0;

        for (const row of jsonData) {
            const pincode = row['Pin Code'];
            const postOffice = row['Post Office'];
            const distance = row['Approximate Distance (in km)'];

            // Skip if distance is "Not Found" or invalid
            if (!pincode || !postOffice || !distance || distance === 'Not Found') {
                console.log(`Skipping row due to missing data or 'Not Found' distance:`, row);
                skipped++;
                continue;
            }

            try {
                await Pincode.create({
                    pincode: parseInt(pincode),
                    postOffice: postOffice.trim(),
                    distance: parseFloat(distance)
                });
                imported++;
            } catch (error) {
                console.log(`Skipping row due to import error for pincode ${pincode}:`, error.message);
                console.log('Problematic row data:', row);
                skipped++;
            }
        }

        console.log(`Import completed: ${imported} imported, ${skipped} skipped`);
        return { imported, skipped };

    } catch (error) {
        console.error('Error importing pincodes:', error);
        throw error;
    }
};

// Function to calculate delivery cost based on pincode
export const calculateDeliveryCost = async (pincode) => {
    try {
        const pincodeData = await Pincode.findOne({ pincode: parseInt(pincode) });

        if (!pincodeData) {
            // Return default delivery cost for unavailable pincodes
            return {
                deliveryCost: 100, // Default delivery cost for unavailable areas
                distance: 0,
                postOffice: 'Service not available',
                isDefault: true
            };
        }

        const distance = pincodeData.distance;

        // delivery cost logic:
        // Base cost: ₹50 for 1 km
        // Additional cost: ₹15 per km after 1 km
        // Example: 1 km = ₹50, 2 km = ₹50 + ₹15 = ₹65, 3 km = ₹50 + (2 * ₹15) = ₹80
        let deliveryCost;
        if (distance <= 1) {
            deliveryCost = 50; // Base cost for up to 1 km
        } else {
            deliveryCost = 50 + Math.ceil(distance - 1) * 15; // ₹50 base + ₹15 per additional km
        }

        return {
            deliveryCost,
            distance: pincodeData.distance,
            postOffice: pincodeData.postOffice,
            isDefault: false
        };

    } catch (error) {
        console.error('Error calculating delivery cost:', error);
        // Return default cost instead of throwing error
        return {
            deliveryCost: 100,
            distance: 0,
            postOffice: 'Service not available',
            isDefault: true,
            error: error.message
        };
    }
};