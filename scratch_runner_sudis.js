const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://eslesme_game:HamzaKa@hamza.55azmjw.mongodb.net/EsleGitsin3D?retryWrites=true&w=majority&appName=Hamza';
const client = new MongoClient(uri);

async function searchAccount() {
    try {
        await client.connect();
        const db = client.db('EsleGitsin3D');
        
        // List all collections in EsleGitsin3D database
        const collections = await db.listCollections().toArray();
        console.log('Collections in EsleGitsin3D:', collections.map(c => c.name));

        for (const colInfo of collections) {
            const col = db.collection(colInfo.name);
            const results = await col.find({
                $or: [
                    { name: { $regex: 'sudi', $options: 'i' } },
                    { fullTag: { $regex: 'sudi', $options: 'i' } },
                    { nickname: { $regex: 'sudi', $options: 'i' } }
                ]
            }).toArray();

            console.log(`Search in collection [${colInfo.name}]: Found ${results.length} matches`);
            if (results.length > 0) {
                console.log(JSON.stringify(results, null, 2));
            }
        }

        // Also check if there are any other databases on this Mongo Atlas cluster!
        const adminDb = db.admin();
        const dbs = await adminDb.listDatabases();
        console.log('\nAll Databases on Mongo Atlas cluster:', dbs.databases.map(d => d.name));

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await client.close();
    }
}

searchAccount();
