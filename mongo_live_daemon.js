// MongoDB Atlas <-> JSONBlob Live Real-Time Bi-Directional Sync Daemon
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://eslesme_game:HamzaKa@hamza.55azmjw.mongodb.net/EsleGitsin3D?retryWrites=true&w=majority&appName=Hamza';
const client = new MongoClient(uri);

const CLOUD_URL = 'https://jsonblob.com/api/jsonBlob/019fcf1b-1d53-7a58-bad9-de2b58944893';

async function runDaemon() {
    console.log('[MongoDaemon] Connecting to MongoDB Atlas...');
    try {
        await client.connect();
        console.log('[MongoDaemon] CONNECTED SUCCESSFULLY TO MONGODB ATLAS!');

        const db = client.db('EsleGitsin3D');
        const collection = db.collection('players');

        // Continuous sync loop every 5 seconds
        setInterval(async () => {
            try {
                // 1. Fetch JSONBlob dataset
                const blobResp = await fetch(CLOUD_URL);
                if (blobResp.ok) {
                    const blobData = await blobResp.json();
                    if (blobData && Array.isArray(blobData.players)) {
                        for (const p of blobData.players) {
                            if (p && p.fullTag) {
                                const clean = { ...p };
                                delete clean._id;

                                // Upsert to MongoDB Atlas preserving highest scores
                                const existing = await collection.findOne({ fullTag: clean.fullTag });
                                if (!existing) {
                                    await collection.insertOne(clean);
                                    console.log(`[MongoDaemon] + NEW PLAYER ADDED TO MONGODB: ${clean.fullTag}`);
                                } else {
                                    const updatedClassicLvl = Math.max(existing.classicLvl || 1, clean.classicLvl || 1);
                                    const updatedClassicScore = Math.max(existing.classicScore || 0, clean.classicScore || 0);
                                    const updatedTtLvl = Math.max(existing.ttLvl || 1, clean.ttLvl || 1);
                                    const updatedTtScore = Math.max(existing.ttScore || 0, clean.ttScore || 0);
                                    const updatedPuzzles = Math.max(existing.puzzles || 0, clean.puzzles || 0);
                                    const updatedOverall = updatedClassicScore + updatedTtScore;

                                    const fieldsToSet = {
                                        ...clean,
                                        classicLvl: updatedClassicLvl,
                                        classicScore: updatedClassicScore,
                                        ttLvl: updatedTtLvl,
                                        ttScore: updatedTtScore,
                                        overallScore: updatedOverall,
                                        puzzles: updatedPuzzles,
                                        puzzleDataStr: clean.puzzleDataStr || existing.puzzleDataStr || ''
                                    };

                                    await collection.updateOne(
                                        { fullTag: clean.fullTag },
                                        { $set: fieldsToSet }
                                    );
                                }
                            }
                        }
                    }
                }

                // 2. Fetch all MongoDB Atlas players, sort by overallScore, and sync back to JSONBlob
                const mongoPlayers = await collection.find({}).sort({ overallScore: -1 }).toArray();
                const cleanMongoList = mongoPlayers.map(p => {
                    const copy = { ...p };
                    delete copy._id;
                    return copy;
                });

                await fetch(CLOUD_URL, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ players: cleanMongoList })
                });

            } catch (loopErr) {
                console.error('[MongoDaemon] Loop error:', loopErr.message);
            }
        }, 5000);

    } catch (err) {
        console.error('[MongoDaemon] Fatal connection error:', err);
    }
}

runDaemon();
