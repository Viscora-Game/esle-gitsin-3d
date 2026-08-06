const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://eslesme_game:HamzaKa@hamza.55azmjw.mongodb.net/EsleGitsin3D?retryWrites=true&w=majority&appName=Hamza';
const client = new MongoClient(uri);

async function searchViscoraUsers() {
    try {
        await client.connect();
        const db = client.db('viscora');
        const col = db.collection('users');

        const results = await col.find({
            $or: [
                { name: { $regex: 'sudi', $options: 'i' } },
                { nickname: { $regex: 'sudi', $options: 'i' } },
                { fullTag: { $regex: 'sudi', $options: 'i' } },
                { username: { $regex: 'sudi', $options: 'i' } }
            ]
        }).toArray();

        console.log(`\n=== MATCHES IN [viscora.users] (Count: ${results.length}) ===`);
        console.log(JSON.stringify(results, null, 2));

        // Also check if there are any other users with sudi in name or email or profile
        const allSudi = await col.find({
            $or: [
                { email: { $regex: 'sudi', $options: 'i' } },
                { tag: { $regex: 'sudi', $options: 'i' } }
            ]
        }).toArray();
        console.log(`Additional matches by email/tag: ${allSudi.length}`);

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

searchViscoraUsers();
