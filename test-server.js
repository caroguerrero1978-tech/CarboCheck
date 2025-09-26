const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    const parsedUrl = url.parse(req.url, true);
    
    if (req.method === 'POST' && parsedUrl.pathname === '/api/food/scan') {
        // Simular respuesta de escaneo
        const response = {
            foodName: "Banana",
            carbohydrates: 23.0,
            sugars: 12.2,
            calories: 89,
            glycemicIndex: 51,
            glycemicClassification: {
                level: "Medio",
                emoji: "🟡",
                recommendation: "Consumo moderado"
            },
            portion: "100g",
            confidence: 0.94,
            timestamp: Date.now()
        };
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response, null, 2));
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(8080, () => {
    console.log('🚀 CarboCheck API Test Server running on http://localhost:8080');
    console.log('📱 Endpoint: POST /api/food/scan');
});
