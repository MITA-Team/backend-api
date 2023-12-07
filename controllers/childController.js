const { childCollection } = require("../app/config");

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
    const data = req.body;
    await childCollection.add({ data });
    res.send({
      message: "Successfully added data!",
      status: 200,
      data: {
        child: data,
      },
    });
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
}