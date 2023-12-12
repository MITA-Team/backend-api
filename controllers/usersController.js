const bcrypt = require("bcrypt");
const { usersCollection } = require("../app/config");

exports.showUsersById = async (req, res) => {
  const id = req.params.id;
  try {
    console.info(req.method, req.url);
    const userRecord = await usersCollection.doc(id).get();
    if (!userRecord.exists) {
      res.status(404).send({ message: "User not found" });
    } else {
      const userData = userRecord.data();
      res.status(200).send({
        message: "Successfully retrieved user data by ID!",
        status: 200,
        data: {
          username: userData.username,
          email: userData.email,
          domicile: userData.domicile,
          birtDate: userData.birthDate,
        }
      });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.updateUsers = async (req, res) => {
  const id = req.params.id;
  const dataToUpdate = req.body;

  try {
    console.info(req.method, req.url);
    console.info(req.body);

    const userRecord = await usersCollection.doc(id).get();
    if (!userRecord.exists) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    const expectedFormat = ["username", "email", "domicile", "birthDate"];
    const inputFormat = Object.keys(dataToUpdate);

    const isFormatValid = expectedFormat.every((key) => inputFormat.includes(key));
    const hasNoExtraFormat = inputFormat.every((key) => expectedFormat.includes(key));

    if (!isFormatValid || !hasNoExtraFormat) {
      return res.status(400).send({
        error: "Invalid request format. Please provide all required fields",
      });
    }

    await usersCollection.doc(id).update(dataToUpdate);

    res.status(200).send({
      message: "Successfully updated user data!",
      status: 200,
    });
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.deleteUsers = async (req, res) => {
  const id = req.params.id;

  try {
    console.info(req.method, req.url);
    const userRecord = await usersCollection.doc(id).get();
    if (!userRecord.exists) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    await usersCollection.doc(id).delete();

    res.status(200).send({
      message: "Successfully deleted user data by ID!",
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting child data:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};


exports.createUsers = async (req, res) => {
  const id = req.params.id;
  const newUser = req.body;

  try {
    console.info(req.method, req.url);
    console.info(req.body);

    // exist user
    const existingUser = await usersCollection.where('email', '==', newUser.email).get();
    if (!existingUser.empty) {
      return res.status(400).send({
        error: "Email is already in use.",
      });
    }

    const expectedFormat = ["username", "email", "domicile", "birthDate", "password", "confirmPass"];
    const inputFormat = Object.keys(newUser);

    const isFormatValid = expectedFormat.every((key) => inputFormat.includes(key));
    const hasNoExtraFormat = inputFormat.every((key) => expectedFormat.includes(key));

    if (!isFormatValid || !hasNoExtraFormat) {
      return res.status(400).send({
        error: "Invalid request format. Please provide all required fields",
      });
    }

    // check password length
    if(newUser.password.length< 6){
      return res.status(400).send({ error:"Password should be at least 6 characters long",})
    }

    // check that password = confirmpass
    if(newUser.password !== newUser.confirmPass){
      return res.status(400).send({ error: "Password and confirm password do not match",});
    }
    delete newUser.confirmPass;

    // hash password before store it in DB
    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    newUser.password = hashedPassword;
  
   const userData = await usersCollection.add(newUser);
    res.status(201).send({
      message: "Successfully added data!",
      status: 201,
      data: {
        id: userData.id,
      }
    });
  } catch (error) {
    console.error("Error adding data:", error);
    res.status(500).send({ error: "Internal Server Error",});
  }
};

exports.loginUsers = async (req, res) => {
  const loginUsers = req.body;

  try {
    console.info(req.method, req.url);
    console.info(req.body);

    if (!loginUsers.identifier || !loginUsers.password) {
      return res.status(400).send({
        error: "Invalid request. Please provide both identifier and password.",
      });
    }

    const userRecord = await usersCollection
      .where('email', '==', loginUsers.identifier)
      .get();

    if (userRecord.empty) {
      const userRecordByUsername = await usersCollection
        .where('username', '==', loginUsers.identifier)
        .get();

      if (userRecordByUsername.empty) {
        return res.status(400).send({
          error: "User not found. Please register an account.",
        });
      }

      const userData = userRecordByUsername.docs[0].data();
      const passwordMatch = await bcrypt.compare(loginUsers.password, userData.password);

      if (!passwordMatch) {
        res.status(404).send({ message: "Incorrect password" });
      } else {
        res.status(200).send({ message: "Login successfully" });
      }
    } else {
     
      const userData = userRecord.docs[0].data();
      const passwordMatch = await bcrypt.compare(loginUsers.password, userData.password);

      if (!passwordMatch) {
        res.status(404).send({ message: "Incorrect password" });
      } else {
        res.status(200).send({ message: "Login successfully" });
      }
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};


exports.logoutUsers = (req, res) => {
  try {
    //blacklist token here

    res.status(200).send({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};


