import mongoose from "mongoose";

export async function connectDB() {
    try {
        // WE USED '!' to tell ts that we will get this uri no matter what or we can also use if else conditions
        mongoose.connect(process.env.MONGO_URI!)
        const connection = mongoose.connection

        connection.on('connected',() => (
            console.log('MONGO DATABASE CONNECTED!') 
        ))

        connection.on('error',(error) => {
            console.log('MONGO DATABASE CONNECTION ERROR,PLEASE MAKE SURE DATABASE IS RUNNING');
            console.log(`MONGO DATABASE CONNECTION ERROR :: ${error}`);
        })

        process.exit()
    } catch (error) {
        console.log(`MONGO DATABASE CONNECTION FAILED! :: ${error}`);
    }
}