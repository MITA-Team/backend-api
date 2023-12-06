const { questCollection } = require("../app/config");

exports.welcome = (req, res) => {
  res.send({
    message: "Welcome to MITA APP API.",
    status: 200,
    content: {
      "GET /api/question/all": "Get all questions",
      "GET /api/question/:id": "Get question by id"
    },
  });
};

exports.showQuestion = async (req, res) => {
  try {
    const snapshot = await questCollection.get();
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.send(list);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.createQuestion = async (req, res) => {
  try {
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
    const doc = await questCollection.doc(id).get();
    if (!doc.exists) {
      res.status(404).send({ message: "Question not found" });
    } else {
      res.send(doc.data());
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
