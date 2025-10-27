import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => console.log("Database Connected"));
        mongoose.connection.on("error", (err) => console.error("MongoDB connection error:", err));

        const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
        if (!uri) {
            throw new Error("Environment variable MONGODB_URI (or MONGO_URI) is not set or is empty");
        }

            // Provide a server selection timeout so the process fails fast when the URI
            // is invalid or the server is unreachable. Also allow specifying an explicit
            // database name via MONGODB_DB so the driver doesn't default to `test`.
            const dbName = process.env.MONGODB_DB || 'mahalasastores';
            await mongoose.connect(uri, {
                serverSelectionTimeoutMS: 10000, // 10s
                dbName,
            });

        return mongoose.connection;
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error && error.message ? error.message : error);
        // Rethrow so callers (scripts) can handle the failure and exit with non-zero code.
        throw error;
    }
};

export default connectDB;