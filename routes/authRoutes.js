module.exports = (app) => {
  const welcomeController = require("../controllers/welcomeController.js");
  const questController = require("../controllers/questController.js");
  const therapyController = require("../controllers/therapyController.js");
  const userController = require("../controllers/userController.js");
  const childController = require("../controllers/childController.js");
  const usersController = require("../controllers/usersController.js");
  
  const { verifyToken } = require('../middleware/index.js');

  const router = require("express").Router();

  // Welcome
  router.get("/", welcomeController.welcome);

  // Question
  router.get("/question/all", verifyToken, questController.showQuestion);
  router.get("/question/:id", verifyToken, questController.showQuestionById);
  router.post("/question/", verifyToken, questController.createQuestion);

  // Therapy
  router.get("/therapy/all", verifyToken, therapyController.showTherapy);
  router.get("/therapy/:id", verifyToken, therapyController.showTherapyById);
  router.post("/therapy/", verifyToken, therapyController.createTherapy);
  
  // User (Ini ke firebase auth sementara tidak terpakai)
  router.get("/user/all", userController.showUser);
  router.get("/user/:id", userController.showUserById);
  router.get("/user/email/:email", userController.showUserByEmail);
  router.post("/user/register", userController.createUser);
  router.put("/user/:id", userController.updateUser);
  router.delete("/user/:id", userController.deleteUser);
  
  // Users (Ini ke DB firestore)
  router.get("/users/:id", verifyToken, usersController.showUsersById);
  router.get("/users/email/:email", verifyToken, usersController.showUsersByEmail);
  router.put("/users/update/:id", verifyToken, usersController.updateUsers);
  router.delete("/users/delete/:id", verifyToken, usersController.deleteUsers);

  router.post("/users/login", usersController.loginUsers);
  router.post("/users/logout", verifyToken, usersController.logoutUsers);
  router.post("/users/register", usersController.createUsers);

  router.post("/users/submit/:id", verifyToken, usersController.submitTestResults);

  // Child (Disabled)
  router.get("/child/all", verifyToken, childController.showChild);
  router.get("/child/:id", verifyToken, childController.showChildById);
  router.post("/child/", verifyToken, childController.createChild);
  router.post("/child/submit/:id", verifyToken, childController.submitTestResults);
  router.put("/child/:id", verifyToken, childController.updateChild);
  router.delete("/child/:id", verifyToken, childController.deleteChild);

  app.use("/api/", router);
};
