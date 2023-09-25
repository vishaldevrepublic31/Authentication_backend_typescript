import mongoose, { Connection } from "mongoose";
 
const connectDb = async (): Promise<Connection> => {
    try {
        const con = await mongoose.connect('mongodb://0.0.0.0:27017/authentication');
        console.log('database connected..');
        return con.connection;
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

export default connectDb;
