const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const app = express();

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

require("./routes/authRoutes")(app);

const port = process.env.PORT || 8080;

const server = app.listen(port, () => {
  console.log(`\nServer running on port ${port}`);
});

module.exports = { app, server };