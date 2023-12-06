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
    const data = await auth.createUser({
      email: req.body.email,
      password: req.body.password,
      emailVerified: false,
      disabled: false,
    });
    res.send({
      message: "Successfully added data!",
      status: 200,
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
