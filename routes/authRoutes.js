module.exports = (app) => {
    const authController = require("../controllers/authController.js");
    const router = require("express").Router();
  
    router.get("/", authController.welcome);
    router.get("/all", authController.showQuestion);
    router.post("/", authController.createQuestion);

  
    app.use("/api/question", router);
  };
  