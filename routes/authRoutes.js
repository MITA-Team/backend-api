module.exports = (app) => {
  const questController = require("../controllers/questController.js");
  const therapyController = require("../controllers/therapyController.js");
  const userController = require("../controllers/userController.js");
  const childController = require("../controllers/childController.js");

  const router = require("express").Router();

  // Welcome
  router.get("/", questController.welcome);

  // Question
  router.get("/question/all", questController.showQuestion);
  router.get("/question/:id", questController.showQuestionById);
  router.post("/question/", questController.createQuestion);

  // Therapy
  router.get("/therapy/all", therapyController.showTherapy);
  router.get("/therapy/:id", therapyController.showTherapyById);
  router.post("/therapy/", therapyController.createTherapy);

  // User
  router.get("/user/all", userController.showUser);
  router.get("/user/:id", userController.showUserById);
  router.get("/user/email/:email", userController.showUserByEmail);
  router.post("/user/register", userController.createUser);
  router.put("/user/:id", userController.updateUser);
  router.delete("/user/:id", userController.deleteUser);

  // Child
  router.get("/child/all", childController.showChild);
  router.get("/child/:id", childController.showChildById);
  router.post("/child/", childController.createChild);
  router.put("/child/:id", childController.updateChild);
  router.delete("/child/:id", childController.deleteChild);

  app.use("/api/", router);
};
