const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://eslesme_game:HamzaKa@hamza.55azmjw.mongodb.net/EsleGitsin3D?retryWrites=true&w=majority&appName=Hamza';
const client = new MongoClient(uri);

async function purgeZeroBots() {
    try {
        await client.connect();
        const db = client.db('EsleGitsin3D');
        const collection = db.collection('players');

        // Find all documents before purge
        const beforeDocs = await collection.find({}).toArray();
        console.log('Players before purge:', beforeDocs.map(p => `${p.fullTag} (${p.overallScore || 0} pts)`));

        // Delete all players with 0 overallScore (except real active players if any)
        const deleteRes = await collection.deleteMany({
            $and: [
                { overallScore: { $lte: 0 } },
                { classicScore: { $lte: 0 } },
                { ttScore: { $lte: 0 } }
            ]
        });
        console.log(`DELETED ${deleteRes.deletedCount} 0-point bot accounts!`);

        // Fetch clean players list
        const cleanPlayers = await collection.find({}).sort({ overallScore: -1 }).toArray();
        console.log('Clean Players remaining:', cleanPlayers.map(p => `${p.fullTag} (${p.overallScore || 0} pts)`));

        const cleanList = cleanPlayers.map(p => {
            const copy = { ...p };
            delete copy._id;
            return copy;
        });

        // Sync clean list to JSONBlob
        const cloudUrl = 'https://jsonblob.com/api/jsonBlob/019fd8e7-e1ac-7a47-aa9f-df3231a31d7f';
        await fetch(cloudUrl, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ players: cleanList })
        });
        console.log('SUCCESS: Synced clean dataset to JSONBlob cloud storage!');

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await client.close();
    }
}

purgeZeroBots();
