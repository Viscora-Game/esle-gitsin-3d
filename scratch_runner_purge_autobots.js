const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://eslesme_game:HamzaKa@hamza.55azmjw.mongodb.net/EsleGitsin3D?retryWrites=true&w=majority&appName=Hamza';
const client = new MongoClient(uri);

async function inspectAndPurgeAutoBots() {
    try {
        await client.connect();
        const db = client.db('EsleGitsin3D');
        const collection = db.collection('players');

        const allPlayers = await collection.find({}).toArray();
        console.log(`Current Total Players in MongoDB Atlas: ${allPlayers.length}`);
        console.log(JSON.stringify(allPlayers, null, 2));

        // Define known real accounts to keep:
        const realTags = ['hamzaxd#6734', 'hamsu#0228', 'sudiş#2802', 'sudiş#1004'];

        // Delete all players not in realTags or with 0 score
        const deleteRes = await collection.deleteMany({
            $or: [
                { overallScore: { $lte: 0 } },
                { fullTag: { $nin: ['HamzaXd#6734', 'HamSu#0228', 'Sudiş#2802', 'Sudiş#1004'] } }
            ]
        });
        console.log(`Purged ${deleteRes.deletedCount} auto-generated bot accounts!`);

        const remaining = await collection.find({}).sort({ overallScore: -1 }).toArray();
        console.log('\nRemaining Real Players in MongoDB Atlas:', remaining.map(p => `${p.fullTag} (${p.overallScore} pts)`));

        const cleanList = remaining.map(p => {
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
        console.log('SUCCESS: Synced clean dataset to JSONBlob!');

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await client.close();
    }
}

inspectAndPurgeAutoBots();
