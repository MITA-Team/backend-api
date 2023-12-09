const { auth } = require("../app/config");

exports.showUser = async (req, res) => {
  try {
    console.info(req.method, req.url);
    const listUsersResult = await auth.listUsers();
    const users = listUsersResult.users.map((userRecord) => {
      const { uid, email, emailVerified, disabled } = userRecord.toJSON();
      return { uid, email, emailVerified, disabled };
    });

    res.send({
      message: "Successfully retrieved user data!",
      status: 200,
      data: {
        user: users,
      },
    });
  } catch (error) {
    console.error("Error retrieving user data:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
exports.createUser = async (req, res) => {
  try {
    console.info(req.method, req.url);
    console.info(req.body);
  
    const expectedFormat = ["email", "password"];
    const inputFormat = Object.keys(req.body);

    const availabeFormat = expectedFormat.every((key) => inputFormat.includes(key));

    const hasNoExtraFormat = inputFormat.every((key) => expectedFormat.includes(key));

    if (!availabeFormat || !hasNoExtraFormat) {
      return res.status(400).send({
        error: "Invalid request format. Please provide all required fields without extra fields.",
      });
    }

    const data = await auth.createUser({
      email: req.body.email,
      password: req.body.password,
      emailVerified: false,
      disabled: false,
    });

    res.send({
      message: "Successfully added data!",
      status: 201,
      data: {
        user: data,
      },
    });
  } catch (error) {
    console.error("Error adding data:", error);
    res.status(500).send({
      error: error.message,
      status: 500,
    });
  }
};

exports.showUserById = async (req, res) => {
  try {
    console.info(req.method, req.url);
    const userId = req.params.id;
    const userRecord = await auth.getUser(userId);
    const { uid, email, emailVerified, disabled } = userRecord.toJSON();

    res.send({
      message: "Successfully retrieved user data by ID!",
      status: 200,
      data: {
        user: { uid, email, emailVerified, disabled },
      },
    });
  } catch (error) {
    console.error("Error retrieving user data by ID:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.showUserByEmail = async (req, res) => {
  const userEmail = req.params.email;

  try {
    console.info(req.method, req.url);

    const userRecord = await auth.getUserByEmail(userEmail);

    if (!userRecord) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    const userData = userRecord.toJSON();

    res.send({
      message: "Successfully retrieved user data by email!",
      status: 200,
      data: {
        user: {
          uid: userData.uid,
          email: userData.email,
          emailVerified: userData.emailVerified,
          disabled: userData.disabled,
        },
      },
    });
  } catch (error) {
    console.error("Error retrieving user data by email:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const dataToUpdate = req.body;

  try {
    console.info(req.method, req.url);
    console.info(req.body);

    const userRecord = await auth.getUser(userId);
    if (!userRecord) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    await auth.updateUser(userId, dataToUpdate);

    const updatedUserRecord = await auth.getUser(userId);
    const updatedUserData = updatedUserRecord.toJSON();

    res.send({
      message: "Successfully updated user data!",
      status: 200,
      data: {
        user: {
          uid: updatedUserData.uid,
          email: updatedUserData.email,
          emailVerified: updatedUserData.emailVerified,
          disabled: updatedUserData.disabled,
        },
      },
    });
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    console.info(req.method, req.url);

    const userRecord = await auth.getUser(userId);
    if (!userRecord) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    await auth.deleteUser(userId);

    res.send({
      message: "Successfully deleted user data!",
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting user data:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

