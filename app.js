const app = require("express")();
const bodyParser = require("body-parser");
const morgan = require("morgan"); // import morgan for request logging
const cors = require("cors"); // import cors for handling Cross-Origin Resource Sharing (CORS)
const { notFound, errorHandler } = require("./middlewares/error-handler");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 8000;

const payment = require("./routes/payment");
const dbConnect = require("./config/dbConnect");
const sendsms = require("./routes/sendsms");

dbConnect();

// apply middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/payment", payment);
app.use("/sms", sendsms);

//error handlers
app.use(notFound);
app.use(errorHandler);

// start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
