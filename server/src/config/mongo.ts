import mongoose from "mongoose";

const connectDb = async(): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGO_URL as string, {
            dbName: "taskify_db",
            serverSelectionTimeoutMS: 30000,
        });

        console.log("Connected to DB");
    } catch (error) {
        console.log("Error while connecting to DB");
        console.log(error);
    }
}

export default connectDb;