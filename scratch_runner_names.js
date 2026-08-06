const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://eslesme_game:HamzaKa@hamza.55azmjw.mongodb.net/EsleGitsin3D?retryWrites=true&w=majority&appName=Hamza';
const client = new MongoClient(uri);

async function listAllNames() {
    try {
        await client.connect();
        
        console.log('=== ESLEGİTSİN3D.PLAYERS ===');
        const p1 = await client.db('EsleGitsin3D').collection('players').find({}).toArray();
        console.log(p1.map(p => p.fullTag || p.name));

        console.log('\n=== VISCORA.USERS ===');
        const p2 = await client.db('viscora').collection('users').find({}).toArray();
        const names = p2.map(u => u.nickname || u.name || u.username || u.email || JSON.stringify(u));
        console.log('Total Viscora Users:', names.length);
        console.log(names.filter(n => typeof n === 'string').join(', '));

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

listAllNames();
