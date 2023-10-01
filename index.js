const express = require("express");
const { connection } = require("./db");
const cors = require("cors");
const rateLimitMiddleware = require("./middlewares/RateLimitMiddleware");
const userRouter = require("./routes/UserRouter");
const categoryRouter = require("./routes/CategoryRouter");
const productRouter = require("./routes/ProductRouter");
const cartRouter = require("./routes/CartRouter");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(rateLimitMiddleware);

app.use("/", userRouter);
app.use("/", categoryRouter);
app.use("/", productRouter);
app.use("/", cartRouter);


app.listen(process.env.PORT, async () => {
    try {
        await connection;
        console.log(`Server is running on ${process.env.PORT} and db is connected`)
    } catch (err) {
        console.log(err)
    }
})