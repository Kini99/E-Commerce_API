const express=require("express");
const { connection } = require("./db");
const cors=require("cors");
const userRouter = require("./routes/UserRoutes");
const rateLimitMiddleware = require("./middlewares/RateLimitMiddleware");
require("dotenv").config();

const app=express();

app.use(cors());
app.use(express.json());

app.use(rateLimitMiddleware);

app.use("/users", userRouter)

app.listen(process.env.PORT,async()=>{
    try{
        await connection;
        console.log(`Server is running on ${process.env.PORT} and db is connected`)
    }catch(err){
        console.log(err)
    }
})