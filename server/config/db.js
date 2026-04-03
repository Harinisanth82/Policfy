import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            family: 4, // Force IPv4 for local DNS issues
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Database Connection Error: ${error.message}`);
        // Log more details if it's a DNS issue
        if (error.message.includes('querySrv')) {
            console.error("TIP: Your network may be blocking MongoDB SRV records. Try using the long format connection string instead.");
        }
        process.exit(1);
    }
};

export default connectDB;
