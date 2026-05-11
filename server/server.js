const app = require("./app");

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./src/models/user.model");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");

    try {
      await User.collection.dropIndex("email_1");
      console.log("Dropped legacy email_1 index");
    } catch (dropError) {
      if (dropError.codeName !== "IndexNotFound") {
        console.warn("Could not drop legacy email_1 index:", dropError.message || dropError);
      }
    }
  })
  .catch(err => console.log(err));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
