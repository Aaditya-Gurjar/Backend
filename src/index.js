import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config();
connectDB()
.then(() =>{
    app.listen(process.env.PORT || 8000, ()=> {
        console.log(`Server is Running at port ${process.env.PORT}`);
    })

    app.on("error", (err) =>{
        console.log("Express connection failed ! ERROR : ",err);
    })
})
.catch((err) => {
    console.log("MONGODB connection failed !!!");
})