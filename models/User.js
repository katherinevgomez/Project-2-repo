// Import Schema and Model
const { Schema, model } = require("../db/connection.js")
const Picture = new Schema({
text: String
})

// The User Schema
const UserSchema = new Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    pictures:[Picture]
  },
  { timestamps: true }
)

// The User Model
const User = model("User", UserSchema)


// Export the User Model
module.exports = User
