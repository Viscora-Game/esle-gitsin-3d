const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://eslesme_game:HamzaKa@hamza.55azmjw.mongodb.net/EsleGitsin3D?retryWrites=true&w=majority&appName=Hamza';
const client = new MongoClient(uri);

async function addSudisPlayer() {
    try {
        await client.connect();
        const db = client.db('EsleGitsin3D');
        const collection = db.collection('players');

        const sudisEntry = {
            fullTag: 'Sudiş#1004',
            name: 'Sudiş',
            tag: '1004',
            classicLvl: 18,
            classicScore: 38200,
            ttLvl: 10,
            ttScore: 92400,
            overallScore: 130600,
            puzzles: 1,
            puzzleDataStr: '',
            updatedAt: Date.now()
        };

        await collection.updateOne(
            { fullTag: sudisEntry.fullTag },
            { $set: sudisEntry },
            { upsert: true }
        );
        console.log('SUCCESS: Sudiş#1004 added to MongoDB Atlas!');

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
        console.log('SUCCESS: Synced fresh player list to JSONBlob!');

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await client.close();
    }
}

addSudisPlayer();
