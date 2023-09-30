const express=require("express");
const { connection } = require("./db");
const cors=require("cors")
require("dotenv").config();

const app=express();

app.use(cors());
app.use(express.json());

app.listen(process.env.PORT,async()=>{
    try{
        await connection;
        console.log(`Server is running on ${process.env.PORT} and db is connected`)
    }catch(err){
        console.log(err)
    }
})