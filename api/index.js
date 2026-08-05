const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb+srv://eslesme_game:HamzaKa@hamza.55azmjw.mongodb.net/EsleGitsin3D?retryWrites=true&w=majority&appName=Hamza';

let cachedClient = null;

async function connectToDatabase() {
    if (cachedClient) return cachedClient;
    const client = new MongoClient(uri);
    await client.connect();
    cachedClient = client;
    return client;
}

module.exports = async (req, res) => {
    // Enable CORS for PWA client
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const client = await connectToDatabase();
        const db = client.db('EsleGitsin3D');
        const collection = db.collection('players');

        if (req.method === 'GET') {
            // Fetch top players sorted by overallScore
            const players = await collection.find({}).sort({ overallScore: -1 }).limit(500).toArray();
            return res.status(200).json({ success: true, players });
        }

        if (req.method === 'POST') {
            const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            if (!body || !body.fullTag) {
                return res.status(400).json({ error: 'Missing fullTag' });
            }

            const { fullTag, name, tag, classicLvl, classicScore, ttLvl, ttScore, overallScore, puzzles, updatedAt } = body;

            // Atomic update of player score in MongoDB Atlas!
            await collection.updateOne(
                { fullTag: fullTag },
                {
                    $set: {
                        fullTag,
                        name: name || fullTag.split('#')[0],
                        tag: tag || '0001',
                        classicLvl: classicLvl || 1,
                        classicScore: classicScore || 0,
                        ttLvl: ttLvl || 1,
                        ttScore: ttScore || 0,
                        overallScore: overallScore || 0,
                        puzzles: puzzles || 0,
                        updatedAt: updatedAt || Date.now()
                    }
                },
                { upsert: true }
            );

            const players = await collection.find({}).sort({ overallScore: -1 }).limit(500).toArray();
            return res.status(200).json({ success: true, players });
        }

        return res.status(405).json({ error: 'Method Not Allowed' });
    } catch (error) {
        console.error('MongoDB API Error:', error);
        return res.status(500).json({ error: error.message });
    }
};
