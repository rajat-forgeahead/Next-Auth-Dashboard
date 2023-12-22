import mongoose from "mongoose";

const connect = async () => {
  const URL  = "mongodb+srv://rjtnamdev:hRvbh4mDfo5rcblv@cluster0.trsqyvl.mongodb.net/?retryWrites=true&w=majority"
  if (mongoose.connections[0].readyState) return;

  try {
    await mongoose.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Mongo Connection successfully established.");
  } catch (error) {
    throw new Error("Error connecting to Mongoose");
  }
};

export default connect;
