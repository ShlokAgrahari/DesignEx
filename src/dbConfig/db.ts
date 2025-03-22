import mongoose from "mongoose";

export async function connect() {
  if (mongoose.connection.readyState === 1) {
    console.log("Already connected to DB");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URL!);
    console.log("DB CONNECTED ✅"); // Ensure logging after successful connection

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
      process.exit(1);
    });
  } catch (error) {
    console.error("Something went wrong during DB connection:", error);
  }
}
