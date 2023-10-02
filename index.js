const express = require("express");
const { connection } = require("./db");
const cors = require("cors");
const swaggerJSdoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const rateLimitMiddleware = require("./middlewares/RateLimitMiddleware");
const userRouter = require("./routes/UserRouter");
const categoryRouter = require("./routes/CategoryRouter");
const productRouter = require("./routes/ProductRouter");
const cartRouter = require("./routes/CartRouter");
const orderRouter = require("./routes/OrderRouter");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const options={
    definition:{
        openapi:"3.0.0",
        info:{
            title:"E-commerce API",
            version:"1.0.0"
        },
        servers:[
            {
                url:`http://localhost:${process.env.PORT}`
            }
        ]
    },
    apis:["./routes/*.js"]
};

const openAPIspec=swaggerJSdoc(options);

// Swagger Documentation API Endpoint
app.use("/docs",swaggerUI.serve, swaggerUI.setup(openAPIspec));

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*'); 
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
//   });

app.use(rateLimitMiddleware);

app.use("/", userRouter);
app.use("/", categoryRouter);
app.use("/", productRouter);
app.use("/", cartRouter);
app.use("/", orderRouter);


app.listen(process.env.PORT, async () => {
    try {
        await connection;
        console.log(`Server is running on ${process.env.PORT} and db is connected`)
    } catch (err) {
        console.log(err)
    }
})