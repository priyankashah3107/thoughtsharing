import mongoose from "mongoose";

const connectMongoDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`connect to mongodb  ${conn.connection.host}`)
  } catch (error) {
      console.log(`Error while connecting to DB ${error.message}`)
      process.exit(1);
  }
}


export default connectMongoDb;