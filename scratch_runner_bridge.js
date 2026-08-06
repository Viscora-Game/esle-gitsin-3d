const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://eslesme_game:HamzaKa@hamza.55azmjw.mongodb.net/EsleGitsin3D?retryWrites=true&w=majority&appName=Hamza';
const client = new MongoClient(uri);

async function syncMongo() {
    try {
        console.log('Connecting to MongoDB Atlas...');
        await client.connect();
        console.log('CONNECTED TO MONGODB ATLAS!');

        const db = client.db('EsleGitsin3D');
        const collection = db.collection('players');

        // Fetch live JSONBlob data
        const blobResp = await fetch('https://jsonblob.com/api/jsonBlob/019fcf1b-1d53-7a58-bad9-de2b58944893');
        if (blobResp.ok) {
            const blobData = await blobResp.json();
            if (blobData && Array.isArray(blobData.players)) {
                console.log(`Found ${blobData.players.length} players in Cloud storage. Syncing to MongoDB...`);
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
        }

        // Also fetch back all players from MongoDB Atlas and print them
        const mongoPlayers = await collection.find({}).sort({ overallScore: -1 }).toArray();
        console.log(`Total Players in MongoDB Atlas (EsleGitsin3D.players): ${mongoPlayers.length}`);
        console.log(JSON.stringify(mongoPlayers, null, 2));

        // Sync MongoDB list back to JSONBlob so JSONBlob has all Mongo players!
        const cleanMongoPlayers = mongoPlayers.map(p => {
            const copy = { ...p };
            delete copy._id;
            return copy;
        });

        await fetch('https://jsonblob.com/api/jsonBlob/019fcf1b-1d53-7a58-bad9-de2b58944893', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ players: cleanMongoPlayers })
        });
        console.log('SUCCESS: Bi-directional MongoDB Atlas <-> JSONBlob Sync Complete!');

    } catch (err) {
        console.error('Sync Error:', err);
    } finally {
        await client.close();
    }
}

syncMongo();
