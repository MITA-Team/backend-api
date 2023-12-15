const { questCollection } = require("../app/config");

exports.showQuestion = async (req, res) => {
  try {
    console.info(req.method, req.url);
    const snapshot = await questCollection.get();
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.send({
      message: "Successfully retrieved question data!",
      status: 200,
      list,
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
      status: 201,
      data,
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
      const list = doc.data();
      res.send({
        message: "Successfully retrieved question data by ID!",
        status: 200,
        list,
      });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
