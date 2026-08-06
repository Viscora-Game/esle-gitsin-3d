const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://eslesme_game:HamzaKa@hamza.55azmjw.mongodb.net/EsleGitsin3D?retryWrites=true&w=majority&appName=Hamza';
const client = new MongoClient(uri);

async function setSudis2802() {
    try {
        await client.connect();
        const db = client.db('EsleGitsin3D');
        const collection = db.collection('players');

        // Delete old Sudiş#1004 if present and insert Sudiş#2802
        await collection.deleteMany({ name: 'Sudiş' });

        const sudisEntry = {
            fullTag: 'Sudiş#2802',
            name: 'Sudiş',
            tag: '2802',
            classicLvl: 22,
            classicScore: 44200,
            ttLvl: 12,
            ttScore: 105800,
            overallScore: 150000,
            puzzles: 2,
            puzzleDataStr: '',
            updatedAt: Date.now()
        };

        await collection.updateOne(
            { fullTag: sudisEntry.fullTag },
            { $set: sudisEntry },
            { upsert: true }
        );
        console.log('SUCCESS: Sudiş#2802 added to MongoDB Atlas!');

        // Fetch all players from Mongo Atlas and update JSONBlob
        const mongoPlayers = await collection.find({}).sort({ overallScore: -1 }).toArray();
        const cleanList = mongoPlayers.map(p => {
            const copy = { ...p };
            delete copy._id;
            return copy;
        });

        const cloudUrl = 'https://jsonblob.com/api/jsonBlob/019fd8e7-e1ac-7a47-aa9f-df3231a31d7f';
        await fetch(cloudUrl, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ players: cleanList })
        });
        console.log('SUCCESS: Synced fresh player list with Sudiş#2802 to JSONBlob!');

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await client.close();
    }
}

setSudis2802();
