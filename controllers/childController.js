const { childCollection } = require("../app/config");
const axios = require('axios');

exports.showChild = async (req, res) => {
  try {
    console.info(req.method, req.url);
    const snapshot = await childCollection.get();
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.send({
      message: "Successfully retrieved child data!",
      status: 200,
      child: list,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.createChild = async (req, res) => {
  try {
    console.info(req.method, req.url);
    console.info(req.body);

    const expectedFormat = ["name", "born", "city", "gender"];

    const inputFormat = Object.keys(req.body);

    const availabeFormat = expectedFormat.every((key) => inputFormat.includes(key));

    const hasNoExtraFormat = inputFormat.every((key) => expectedFormat.includes(key));

    if (!availabeFormat || !hasNoExtraFormat) {
      return res.status(400).send({
        error: "Invalid request format. Please provide all required fields without extra fields.",
      });
    }

    const data = req.body;

    const addAllData = await childCollection.add({ data });

    const response = {
      message: "Successfully added data!",
      status: 201,
      data: [
        {
          id: addAllData.id,
          child: data,
        },
      ],
    };

    res.status(response.status).send(response);
  } catch (error) {
    console.error("Error adding data:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.showChildById = async (req, res) => {
  const id = req.params.id;
  try {
    console.info(req.method, req.url);
    const doc = await childCollection.doc(id).get();
    if (!doc.exists) {
      res.status(404).send({ message: "Child not found" });
    } else {
      const childData = doc.data();
      res.send({
        message: "Successfully retrieved child data by ID!",
        status: 200,
        id: doc.id,
        child: childData,
      });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.updateChild = async (req, res) => {
  const id = req.params.id;

  try {
    console.info(req.method, req.url);
    console.info(req.body);

    const userRecord = await childCollection.doc(id).get();
    if (!userRecord.exists) {
      res.status(404).send({ message: "Child not found" });
      return;
    }

    const expectedFormat = ["name", "born", "city", "gender"];

    const inputFormat = Object.keys(req.body);

    const availabeFormat = expectedFormat.every((key) => inputFormat.includes(key));

    const hasNoExtraFormat = inputFormat.every((key) => expectedFormat.includes(key));

    if (!availabeFormat || !hasNoExtraFormat) {
        return res.status(400).send({
          error: "Invalid request format. Please provide all required fields without extra fields.",
        });
      }

    delete req.params.id;
    const data = req.body;

    await childCollection.doc(id).update({ data });

    res.send({
      message: "Successfully updated child data by ID!",
      status: 200,
      data,
    });
  } catch (error) {
    console.error("Error updating child data:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.deleteChild = async (req, res) => {
  const id = req.params.id;

  try {
    console.info(req.method, req.url);
    const userRecord = await childCollection.doc(id).get();
    if (!userRecord.exists) {
      res.status(404).send({ message: "Child not found" });
      return;
    }

    await childCollection.doc(id).delete();

    res.send({
      message: "Successfully deleted child data by ID!",
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting child data:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.submitTestResults = async (req, res) => {
  try {
    console.info(req.method, req.url);
    console.info(req.body);

    const childId = req.params.id;

    const testData = req.body;

    if (!childId || typeof childId !== 'string') {
      throw new Error('Invalid childId provided in the request parameters.');
    }

    const recommendations = await getRecommendationsFromPython(testData);

    console.info('Recommendations from Python server:', recommendations);

    if (!recommendations || recommendations.length === 0) {
      throw new Error('No recommendations received from the Python server.');
    }

    await childCollection.doc(childId).update({
      recommendation: recommendations,
    });

    const response = {
      message: 'Test results submitted successfully!',
      status: 200,
      data: {
        childId: childId,
        recommendations: recommendations,
      },
    };

    res.status(response.status).send(response);
  } catch (error) {
    console.error('Error submitting test results:', error);
    res.status(500).send({ error: error.message || 'Internal Server Error' });
  }
};

exports.updateResultChild = async (req, res) => {
  const id = req.params.id;

  try {
    console.info(req.method, req.url);
    console.info(req.body);

    const userRecord = await childCollection.doc(id).get();
    if (!userRecord.exists) {
      res.status(404).send({ message: "Child not found" });
      return;
    }

    const expectedFormat = ["name", "born", "city", "gender"];

    const inputFormat = Object.keys(req.body);

    const availabeFormat = expectedFormat.every((key) => inputFormat.includes(key));

    const hasNoExtraFormat = inputFormat.every((key) => expectedFormat.includes(key));

    if (!availabeFormat || !hasNoExtraFormat) {
        return res.status(400).send({
          error: "Invalid request format. Please provide all required fields without extra fields.",
        });
      }

    delete req.params.id;
    const data = req.body;

    const recommendations = await getRecommendationsFromPython(data);

    data.recommendation = recommendations;
    await childCollection.doc(id).update(data);

    res.send({
      message: "Successfully updated child data by ID!",
      status: 200,
      data,
    });
  } catch (error) {
    console.error("Error updating child data:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

async function getRecommendationsFromPython(data) {
  try {
    const pythonServerUrl = 'http://34.101.192.86/predict'; 
    
    const response = await axios.post(pythonServerUrl, data);

    if (!response.data || !response.data.top_predictions) {
      throw new Error('No recommendations received from the Python server.');
    }

    const predictions = response.data;

    console.log('Predicted Label:', predictions.prediction_asd);

    console.log('Image URL:', predictions.image);

    console.log('Top Predictions:', predictions.top_predictions);

    return response.data;
  } catch (error) {
    console.error("Error getting recommendations from Python server:", error);
    throw new Error("Failed to get recommendations from Python server");
  }
}
