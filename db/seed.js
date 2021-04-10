//Import The Database Connection
const mongoose = require("./connection");

///////////////////////////////////////////
// IMPORT YOUR MODELS BELOW
///////////////////////////////////////////

///////////////////////////////////////////
// DO YOUR DATABASE OPERATIONS IN BELOW FUNCTION
///////////////////////////////////////////

const seed = async () => {
  // Drop the Database before seeding
  mongoose.connection.db.dropDatabase();

  //*********Code Goes Here
  const pictures = await Picture.create([
    {img: "https://www.iims.org.uk/wp-content/uploads/2019/09/DSC_0008.jpg"},
  ])
  //***************************** */

  mongoose.disconnect();
};

// Wait for the DB Connection to be Established
mongoose.connection.on("open", () => {
  // Run Seed Function
  seed();
});
