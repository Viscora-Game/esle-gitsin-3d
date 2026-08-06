const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://eslesme_game:HamzaKa@hamza.55azmjw.mongodb.net/EsleGitsin3D?retryWrites=true&w=majority&appName=Hamza';
const client = new MongoClient(uri);

async function searchTag2802() {
    try {
        await client.connect();
        
        const dbs = ['EsleGitsin3D', 'viscora'];
        for (const dbName of dbs) {
            const db = client.db(dbName);
            const collections = await db.listCollections().toArray();
            for (const colInfo of collections) {
                const col = db.collection(colInfo.name);
                const results = await col.find({
                    $or: [
                        { tag: '2802' },
                        { tag: 2802 },
                        { fullTag: { $regex: '2802' } },
                        { name: { $regex: '2802' } }
                    ]
                }).toArray();

                console.log(`[${dbName}.${colInfo.name}] Search 2802 Matches:`, results.length);
                if (results.length > 0) {
                    console.log(JSON.stringify(results, null, 2));
                }
            }
        }

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

searchTag2802();
