import mongoose from "mongoose";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDb = async () => {
  try {
    console.log("MongoDB URI exists:", !!process.env.MONGODB_URI);

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ DB connected");
  } catch (error) {
    console.error("❌ DB error:", error);
  }
};

export default connectDb;
