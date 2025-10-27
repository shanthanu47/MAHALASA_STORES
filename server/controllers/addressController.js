import Address from "../models/Address.js";

// Upsert Address: /api/address/save
export const saveAddress = async (req, res) => {
    try {
        const { address, userId } = req.body;

        // Find the address by userId and update it, or create a new one if it doesn't exist
        const existingAddress = await Address.findOneAndUpdate(
            { userId },
            { ...address, userId },
            { new: true, upsert: true, runValidators: true }
        );

        res.json({
            success: true,
            message: "Address saved successfully",
            address: existingAddress,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: "An error occurred while saving the address." });
    }
};

// Get Address: /api/address/get
export const getAddress = async (req, res) => {
    try {
        const { userId } = req.body;
        const address = await Address.findOne({ userId });

        if (!address) {
            return res.json({ success: true, address: null });
        }

        res.json({ success: true, address });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: "An error occurred while fetching the address." });
    }
};
