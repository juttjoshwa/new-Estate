import mongoose from "mongoose";

const DB_connect = () => {
  mongoose
    .connect(process.env.DB, {})
    .then((res) => {
      console.log("DB connected successfully");
    })
    .catch((error) => {
      console.log(error.message);
    });
};

export default DB_connect;
