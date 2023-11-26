import mongoose from "mongoose";

// Define Mongodb schema
const Schema = mongoose.Schema;
const UsersSchema = new Schema({
  nama: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  telp: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Users", UsersSchema);
