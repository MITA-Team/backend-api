const admin = require("firebase-admin");

const serviceAccount = require("../serviceAccountKey.json");

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://latihan-capstone-default-rtdb.asia-southeast1.firebasedatabase.app",
  });
} catch (error) {
  console.error("Gagal Connect ke Firebase:", error);
  process.exit(1);
}

const db = admin.firestore();
const questCollection = db.collection("question");
const therapyCollection = db.collection("therapyRecommendation");

module.exports = { questCollection, therapyCollection };
