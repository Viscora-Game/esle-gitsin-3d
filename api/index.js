const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb+srv://eslesme_game:HamzaKa@hamza.55azmjw.mongodb.net/EsleGitsin3D?retryWrites=true&w=majority&appName=Hamza';

let cachedClient = null;

function isProfane(text) {
    if (!text) return false;
    const nameOnly = String(text).includes('#') ? String(text).split('#')[0] : String(text);
    const raw = nameOnly.toLowerCase().trim();
    if (!raw) return false;

    const profanitySubstrings = [
        'amk', 'amq', 'orospu', 'yarrak', 'yarak', 'yavsak', 'yavşak', 'amcik', 'amcık',
        'kahpe', 'puşt', 'pust', 'fahişe', 'fahise', 'dalyarak', 'gavat', 'kaltak', 'taşak', 'tasak',
        'fuck', 'bitch', 'asshole', 'cunt', 'dick', 'bastard', 'pussy', 'nigger', 'nigga', 'whore',
        'slut', 'faggot', 'porno', 'porn'
    ];

    for (const bad of profanitySubstrings) {
        if (raw.includes(bad)) return true;
    }

    const exactOrBoundary = ['sik', 'piç', 'pic', 'oç', 'oc', 'aq', 'göt', 'got', 'ibne', 'meme'];
    const tokens = raw.split(/[\s_\-.\d]+/);
    for (const bad of exactOrBoundary) {
        if (raw === bad || tokens.includes(bad)) return true;
    }

    if (raw.includes('sik') || raw.includes('sık')) {
        const innocent = ['klasik', 'eksik', 'fizik', 'müzik', 'kesik', 'biscuit', 'sıkı', 'sıkıcı', 'ışık'];
        const isKnownInnocent = innocent.some(inn => raw.includes(inn));
        if (!isKnownInnocent) return true;
    }

    if (raw.includes('göt') || raw.includes('gotveren') || raw.includes('götl')) {
        return true;
    }

    return false;
}

function sanitizePlayer(player) {
    if (!player) return player;
    if (isProfane(player.fullTag) || isProfane(player.name)) {
        const tag = player.tag || (player.fullTag && player.fullTag.includes('#') ? player.fullTag.split('#')[1] : '0001');
        player.name = 'Oyuncu';
        player.fullTag = 'Oyuncu#' + tag;
    }
    return player;
}


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
            return res.status(200).json({ success: true, players: players.map(sanitizePlayer) });
        }

        if (req.method === 'POST') {
            const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            if (!body || !body.fullTag) {
                return res.status(400).json({ error: 'Missing fullTag' });
            }

            let { fullTag, name, tag, classicLvl, classicScore, ttLvl, ttScore, overallScore, puzzles, puzzleDataStr, updatedAt } = body;
            if (isProfane(fullTag) || isProfane(name)) {
                tag = tag || (fullTag && fullTag.includes('#') ? fullTag.split('#')[1] : '0001');
                name = 'Oyuncu';
                fullTag = 'Oyuncu#' + tag;
            }

            // Atomic update of player score & puzzle collection in MongoDB Atlas!
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
                        puzzleDataStr: puzzleDataStr || '',
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
