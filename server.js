const app = require("./app");
const mongoose = require("mongoose");

mongoose.connect(" mongodb://127.0.0.1:27017/BMI").then(() => {
  console.log("DB connection successful");
});

const port = 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
