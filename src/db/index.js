import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try{
        const connectInstance = await mongoose.connect(`${process.env.MONGOdB_URI}/${DB_NAME}`)
        console.log(`\n MongoDb is connected ! DB HOST: ${connectInstance.connection.host}`)
    }catch(error){
        console.log("MONGODB connection Error: ", error);
        process.exit(1);
    }
}

export default connectDB