const express = require("express");
const cors = require("cors");
const app = express();

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));

require("./routes/authRoutes")(app);


const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`\nServer running on port ${port}`);
});