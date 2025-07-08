const { MongoClient } = require('mongodb');

// ✅ URI দাও — লোকাল হলে এটা, না হলে তোমার MongoDB Atlas URI
const uri = "mongodb+srv://Profast_admin:wjZzlE0a7AAWAOgD@cluster0.zsjpk5h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // <-- এটা ঠিক করে দিও

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();

    const database = client.db("Profast");
    const parcels = database.collection("parcels");

    const result = await parcels.updateMany(
      {},
      { $set: { cashout_status: "pending" } }
    );

    console.log(`✅ Modified ${result.modifiedCount} documents`);
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await client.close();
  }
}

run();
