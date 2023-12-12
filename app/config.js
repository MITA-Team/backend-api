const admin = require("firebase-admin");

const serviceAccount = require("../serviceAccountKey.json");

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
} catch (error) {
  console.error("Gagal Connect ke Firebase:", error);
  process.exit(1);
}

const db = admin.firestore();
const auth = admin.auth();

const questCollection = db.collection("question");
const therapyCollection = db.collection("therapyRecommendation");
const childCollection = db.collection("childs");
const usersCollection = db.collection("user");

module.exports = { 
  questCollection, 
  therapyCollection,
  childCollection,
  usersCollection,
  auth,
};
