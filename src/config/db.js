// MongoDB Database Connection Configuration
// TODO: Uncomment and configure when ready to connect to MongoDB Atlas

/*
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // TODO: Replace with your MongoDB Atlas connection string
    // Connection string should be stored in .env file as MONGO_URI
    // Example: mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
*/

// Placeholder function for mock environment
export const connectDB = () => {
  console.log('MongoDB connection stub - using mock data');
  // TODO: Replace with actual MongoDB connection when deploying
  // For now, the app uses mockApi.js for all data operations
};

export default connectDB;
