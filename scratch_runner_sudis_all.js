const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://eslesme_game:HamzaKa@hamza.55azmjw.mongodb.net/EsleGitsin3D?retryWrites=true&w=majority&appName=Hamza';
const client = new MongoClient(uri);

async function searchAllDbs() {
    try {
        await client.connect();
        
        const dbsToSearch = ['EsleGitsin3D', 'viscora', 'admin', 'local'];

        for (const dbName of dbsToSearch) {
            const db = client.db(dbName);
            const collections = await db.listCollections().toArray();
            console.log(`\n--- Searching Database [${dbName}] (Collections: ${collections.map(c=>c.name).join(', ')}) ---`);

            for (const colInfo of collections) {
                const col = db.collection(colInfo.name);
                const count = await col.countDocuments({});
                console.log(`Collection [${dbName}.${colInfo.name}] Total Docs: ${count}`);

                const results = await col.find({
                    $or: [
                        { name: { $regex: 'sudi', $options: 'i' } },
                        { fullTag: { $regex: 'sudi', $options: 'i' } },
                        { nickname: { $regex: 'sudi', $options: 'i' } },
                        { tag: { $regex: 'sudi', $options: 'i' } }
                    ]
                }).toArray();

                if (results.length > 0) {
                    console.log(`>>> MATCH FOUND IN [${dbName}.${colInfo.name}]:`, JSON.stringify(results, null, 2));
                }

                // Print all documents if total count <= 20
                if (count <= 20) {
                    const allDocs = await col.find({}).toArray();
                    console.log(`Docs in [${dbName}.${colInfo.name}]:`, allDocs.map(d => d.name || d.fullTag || d.nickname || d.username || d._id));
                }
            }
        }

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await client.close();
    }
}

searchAllDbs();
