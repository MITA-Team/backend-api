const bcrypt = require("bcrypt");
const { usersCollection } = require("../app/config");
const jwt = require("jsonwebtoken");
const { blacklistToken } = require("../middleware/index.js");
const axios = require('axios');

exports.showUsersById = async (req, res) => {
  const id = req.params.id;
  try {
    console.info(req.method, req.url);
    console.log("Searching for user with Id:", id);
    const userRecord = await usersCollection.doc(id).get();
    if (!userRecord.exists) {
      res.status(404).send({ message: "User not found" });
    } else {
      const userData = userRecord.data();
      res.status(200).send({
        message: "Successfully retrieved user data by ID!",
        status: 200,
        id: userRecord.id,
        data: {
          username: userData.username,
          email: userData.email,
          domicile: userData.domicile,
          birthDate: userData.birthDate,
          recommendation: userData.recommendation
        }
      });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.showUsersByEmail = async (req, res) => {
  const email = req.params.email;
  try {
    console.info(req.method, req.url);
    console.log("Searching for user with email:", email);

    const querySnapshot = await usersCollection.where('email', '==', email).get();

    // console.log("Query result:", querySnapshot.docs.map(doc => doc.data()));

    if (querySnapshot.empty) {
      res.status(404).send({ message: "User not found" });
    } else {
      const userId = querySnapshot.docs[0]
      const userData = userId.data();
      res.status(200).send({
        message: "Successfully retrieved user data by email!",
        status: 200,
        id: userId.id,
        data: {
          username: userData.username,
          email: userData.email,
          domicile: userData.domicile,
          birthDate: userData.birthDate,
          recommendation: userData.recommendation
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

    const token = req.headers.authorization.split(" ")[1];
    
    // Tambahkan token ke dalam daftar hitam
    blacklistToken(token);
    res.clearCookie('token');

    res.status(200).send({
      message: "Successfully deleted user data by ID!",
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting user data:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.createUsers = async (req, res) => {
  const id = req.params.id;
  const newUser = req.body;

  try {
    console.info(req.method, req.url);

    // exist user
    const existingEmail = await usersCollection.where('email', '==', newUser.email).get();
    if (!existingEmail.empty) {
      return res.status(400).send({
        error: "Email is already in use.",
      });
    }

    const existingUsername = await usersCollection.where('username', '==', newUser.username).get();
    if (!existingUsername.empty) {
      return res.status(400).send({
        error: "Username is already in use.",
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
        ...newUser
      }
    });
    console.info(req.body);
  } catch (error) {
    console.error("Error adding data:", error);
    res.status(500).send({ error: "Internal Server Error",});
  }
};

exports.loginUsers = async (req, res) => {
  const loginUsers = req.body;

  try {
    console.info(req.method, req.url);

    const expectedFormat = ["identifier", "password"];

    const inputFormat = Object.keys(req.body);

    const availabeFormat = expectedFormat.every((key) => inputFormat.includes(key));

    const hasNoExtraFormat = inputFormat.every((key) => expectedFormat.includes(key));

    if (!availabeFormat || !hasNoExtraFormat) {
      return res.status(400).send({
        error: "Invalid request format. Please provide all required fields without extra fields.",
      });
    }

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
        .where('email', '==', loginUsers.identifier)
        .get();

      if (userRecordByUsername.empty) {
        return res.status(400).send({
          error: "email not found. Please register an account.",
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
        jwt.sign(userData, 'secret', { expiresIn: '12h' }, (err, token) => {
          if (err) {
            console.error("Error generating token:", err);
            res.status(500).send({ error: "Internal Server Error" });
            return;
          }
          console.info(userData);
          res.status(200).send({ message: "Login successfully", token });
        });        
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
    const token = req.headers.authorization.split(" ")[1];
    
    // Tambahkan token ke dalam daftar hitam
    blacklistToken(token);
    res.clearCookie('token');
    console.log("Logout successful", req.url);
    res.status(200).send({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.submitTestResults = async (req, res) => {
  try {
    console.info(req.method, req.url)
    console.info(req.body)

    const usersId = req.params.id
    const testData = req.body;

    if (!usersId || typeof usersId !== 'string'){
      throw new Error('Invalid usersId provided in the request parameters.');
    }

    const recommendations = await getRecommendationsFromPython(testData);

    console.info('Recommendations from Python server:', recommendations);

    if (!recommendations || recommendations.length === 0){
      throw new Error('No recommendations found from Python server.');
    }

    await usersCollection.doc(usersId).update({
      recommendation: recommendations,
    });

    const response = {
      message: 'Test results submitted successfully!',
      status: 200,
      data: {
        usersId: usersId,
        recommendations: recommendations,
      },
    };

    res.status(response.status).send(response);
  } catch (error){
    console.error('Error submitting test results:', error);
    res.status(500).send({ error: error.message || 'Internal Server Error' });
  }
}

exports.updateResultUsers = async (req, res) => {
  const id = req.params.id;

  try {
    console.info(req.method, req.url);
    console.info(req.body);

    const userRecord = await usersCollection.doc(id).get();
    if (!userRecord.exists) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    delete req.params.id;
    const data = req.body;

    const recommendations = await getRecommendationsFromPython(data);

    data.recommendation = recommendations;
    await usersCollection.doc(id).update(data);

    res.send({
      message: "Data updated successfully!",
      status: 200,
      data: {
        id: id,
        data: data,
      },
    })

  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

async function getRecommendationsFromPython(data) {
  try {
    const pythonServerUrl = 'http://34.101.192.86/predict';
    const response = await axios.post(pythonServerUrl, data);

    if (!response.data || !response.data.top_predictions){
      throw new Error('No recommendations received from the Python server.');
    }

    const predictions = response.data;

    console.log('Predicted Label:', predictions.prediction_asd);
    console.log('Image URL:', predictions.image);
    console.log('Top Predictions:', predictions.top_predictions);

    return response.data;

  } catch (error) {
    console.error('Error fetching recommendations from Python server:', error);
    throw new Error('Failed to get recommendations from Python server');
  }
}