import { importPincodesFromExcel, calculateDeliveryCost } from '../configs/importPincodes.js';

// Import pincodes from excel file : /api/pincode/import
export const importPincodes = async (req, res) => {
    try {
        const result = await importPincodesFromExcel();
        res.json({
            success: true,
            message: 'Pincode import process completed.',
            data: result
        });
    } catch (error) {
        console.error('Pincode import failed:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to import pincodes. See server logs for details.'
        });
    }
};

// Get delivery cost for a specific pincode
export const getDeliveryCost = async (req, res) => {
    try {
        const { pincode } = req.params;

        // Validate pincode format
        if (!/^\d{6}$/.test(pincode)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid pincode format. Must be a 6-digit number.'
            });
        }

        const deliveryInfo = await calculateDeliveryCost(pincode);

        res.json({
            success: true,
            message: 'Delivery cost calculated successfully',
            data: deliveryInfo
        });

    } catch (error) {
        console.error('Error calculating delivery cost:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to calculate delivery cost'
        });
    }
};