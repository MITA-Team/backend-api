const { questCollection } = require("../app/config");

exports.welcome = (req, res) => {
  res.send({
    message: "Welcome to MITA APP API.",
    status: 200,
    content: {
      "GET /api/question/all": "Get all questions",
      "GET /api/question/:id": "Get question by id",
      "GET /api/therapy/all": "Get all therapies",
      "GET /api/therapy/:id": "Get therapy by id",
    },
  });
};

exports.showQuestion = async (req, res) => {
  try {
    console.info(req.method, req.url);
    const snapshot = await questCollection.get();
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.send({
      message: "Successfully retrieved therapy data!",
      status: 200,
      data: {
        question: list,
      },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.createQuestion = async (req, res) => {
  try {
    console.info(req.method, req.url);
    console.info(req.body);
    const data = req.body;
    await questCollection.add({ data });
    res.send({ 
      message: "Successfully added data!",
      status: 200,
      data: {
        question: data,
      } 
    });
  } catch (error) {
    console.error("Error adding data:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.showQuestionById = async (req, res) => {
  const id = req.params.id;
  try {
    console.info(req.method, req.url);
    const doc = await questCollection.doc(id).get();
    if (!doc.exists) {
      res.status(404).send({ message: "Question not found" });
    } else {
      const therapyData = doc.data();
      res.send({
        message: "Successfully retrieved therapy data by ID!",
        status: 200,
        data: {
          question: therapyData,
        },
      });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
