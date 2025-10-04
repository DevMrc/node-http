const http = require('http');
const { URL } = require('url');

let todos = [
    { id: 1, task: 'Study node.js', completed: false },
    { id: 2, task: 'Build an API', completed: false }
];

const server = http.createServer((req, res) => {
    const { method } = req;
    const parsedURL = new URL(req.url, `http://${req.headers.host}`);
    const pathname = parsedURL.pathname;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (method === 'GET' && pathname === '/todos') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(todos));
    }
    else if (method === 'POST' && pathname === '/todos') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                const newTodo = JSON.parse(body);
                newTodo.id = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;
                todos.push(newTodo);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newTodo));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
    }
    else if (method === 'PUT' && pathname.startsWith('/todos/')) {
        const id = parseInt(pathname.split('/')[2]);
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                const updatedTodo = JSON.parse(body);
                const index = todos.findIndex(t => t.id === id);

                if (index === -1) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Todo not found' }));
                } else {
                    todos[index] = { ...todos[index], ...updatedTodo };
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(todos[index]));
                }
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
    }
    else if (method === 'DELETE' && pathname.startsWith('/todos/')) {
        const id = parseInt(pathname.split('/')[2]);
        const index = todos.findIndex(t => t.id === id);

        if (index === -1) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Todo not found' }));
        } else {
            todos = todos.filter(t => t.id !== id);
            res.writeHead(204);
            res.end();
        }
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
    }
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
