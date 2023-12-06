module.exports = (app) => {
  const questController = require("../controllers/questController.js");
  const therapyController = require("../controllers/therapyController.js");
  const router = require("express").Router();

  router.get("/", questController.welcome);
  router.get("/question/all", questController.showQuestion);
  router.get("/question/:id", questController.showQuestionById);
  router.post("/question/", questController.createQuestion);


  router.get("/therapy/all", therapyController.showTherapy);
  router.get("/therapy/:id", therapyController.showTherapyById);
  router.post("/therapy/", therapyController.createTherapy);

  app.use("/api/", router);
};
