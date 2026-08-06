const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://eslesme_game:HamzaKa@hamza.55azmjw.mongodb.net/EsleGitsin3D?retryWrites=true&w=majority&appName=Hamza';
const client = new MongoClient(uri);

async function inspectData() {
    try {
        await client.connect();
        const db = client.db('EsleGitsin3D');
        const collection = db.collection('players');

        const mongoPlayers = await collection.find({}).toArray();
        console.log('=== MONGODB ATLAS PLAYERS (Count: ' + mongoPlayers.length + ') ===');
        mongoPlayers.forEach((p, idx) => {
            console.log(`\nPlayer #${idx + 1}: ${p.fullTag || p.name}`);
            console.log(`  Name: ${p.name}, Tag: ${p.tag}, FullTag: ${p.fullTag}`);
            console.log(`  Classic: Lvl ${p.classicLvl}, Score ${p.classicScore}`);
            console.log(`  TimeTrial: Lvl ${p.ttLvl}, Score ${p.ttScore}`);
            console.log(`  OverallScore: ${p.overallScore}`);
            console.log(`  Puzzles: ${p.puzzles}`);
            console.log(`  Has puzzleDataStr? ${!!p.puzzleDataStr}`);
        });

        const blobResp = await fetch('https://jsonblob.com/api/jsonBlob/019fcf1b-1d53-7a58-bad9-de2b58944893');
        if (blobResp.ok) {
            const blobData = await blobResp.json();
            console.log('\n=== JSONBLOB PLAYERS (Count: ' + (blobData.players ? blobData.players.length : 0) + ') ===');
            if (blobData.players) {
                blobData.players.forEach((p, idx) => {
                    console.log(`  [${idx + 1}] ${p.fullTag}: Overall=${p.overallScore}, Classic=${p.classicScore}, TT=${p.ttScore}`);
                });
            }
        }
    } catch(e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

inspectData();
