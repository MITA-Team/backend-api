const { therapyCollection } = require("../app/config");

exports.showTherapy = async (req, res) => {
  try {
    console.info(req.method, req.url);
    const snapshot = await therapyCollection.get();
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.send({
        message: "Successfully retrieved therapy data!",
        status: 200,
        list
      });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.createTherapy = async (req, res) => {
  try {
    console.info(req.method, req.url);
    console.info(req.body);
    const data = req.body;
    await therapyCollection.add({ data });
    res.send({
      message: "Successfully added data!",
      status: 201,
      data: {
        therapy: data,
      },
    });
  } catch (error) {
    console.error("Error adding data:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.showTherapyById = async (req, res) => {
  const id = req.params.id;
  try {
    console.info(req.method, req.url);
    const doc = await therapyCollection.doc(id).get();
    if (!doc.exists) {
      res.status(404).send({ message: "Therapy not found" });
    } else {
      const list = doc.data();
      res.send({
        message: "Successfully retrieved therapy data by ID!",
        status: 200,
        list
      });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
