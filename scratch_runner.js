const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://eslesme_game:HamzaKa@hamza.55azmjw.mongodb.net/EsleGitsin3D?retryWrites=true&w=majority&appName=Hamza';
const client = new MongoClient(uri);

async function run() {
    try {
        console.log('Connecting to MongoDB Atlas...');
        await client.connect();
        console.log('SUCCESSFULLY CONNECTED TO MONGODB ATLAS!');
        const db = client.db('EsleGitsin3D');
        const collection = db.collection('players');

        // Ensure index for lighting fast sorting
        await collection.createIndex({ overallScore: -1 });
        await collection.createIndex({ classicScore: -1 });
        await collection.createIndex({ ttScore: -1 });
        await collection.createIndex({ fullTag: 1 }, { unique: true });

        // Migrate current cloud data from jsonblob into MongoDB Atlas!
        const blobResp = await fetch('https://jsonblob.com/api/jsonBlob/019fcf1b-1d53-7a58-bad9-de2b58944893');
        const blobData = await blobResp.json();
        if (blobData && Array.isArray(blobData.players)) {
            console.log('Migrating', blobData.players.length, 'players from JSONBlob to MongoDB Atlas...');
            for (const p of blobData.players) {
                if (p && p.fullTag) {
                    delete p._id; // Ensure clean Mongo insertion
                    await collection.updateOne(
                        { fullTag: p.fullTag },
                        { $set: p },
                        { upsert: true }
                    );
                }
            }
        }

        const count = await collection.countDocuments();
        console.log('Total players in MongoDB Atlas EsleGitsin3D.players:', count);
        const sample = await collection.find({}).sort({ overallScore: -1 }).toArray();
        console.log('Migrated Players in Mongo Atlas:', JSON.stringify(sample, null, 2));
    } catch(err) {
        console.error('Connection error:', err);
    } finally {
        await client.close();
    }
}

run();
