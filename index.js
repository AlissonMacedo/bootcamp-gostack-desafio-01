const express = require('express');

const server = express();
server.use(express.json());


/**
 *  numberOfRequests conta a
 * quantidade de requests
 */

let numberOfRequests = 0;
const projects = [];

/**
 * Middleware checa se o
 * projeto existe.
 */

function checkProjectExist(req, res, next) {
    const { id } = req.params
    const project = projects.find(p => p.id === id);

    if(!project) {
        return res.status(400).json({ error: 'Project not found' });
    }
    
    return next();
};

/**
 * Middleware que da log no 
 * número de requisições
 */
function logRequests(req, res, next) {
    numberOfRequests++;

    console.log(`Número de requisições: ${numberOfRequests}`);

    return next();
}

server.use(logRequests);

/**
 * Projects - lista todos projetos.
 * 
 * Acess - http://localhost:3000/projects/
 */
server.get('/projects', (req, res) => {
    return res.json(projects)
});

server.post('/projects', (req, res) => {
    const { id, title } = req.body;

    const project = {
        id,
        title,
        tasks: []
    };

    const projectTest = projects.find(p => p.id === id);

    if(projectTest) {
        return res.status(400).json({ error: 'Project already exists' });
    }

    projects.push(project);

    return res.json(project);
});

/** para editar
 * 1 é exemplo, use PUT para teste
 *  Acess - http://localhost:3000/projects/1
 */

server.put('/projects/:id', checkProjectExist, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(p => p.id === id);

    project.title = title;

    return res.json(project);
});

/** para editar
 * 1 é exemplo, use DELETE para teste
 *  Acess - http://localhost:3000/projects/1
 */

server.delete('/projects/:id', checkProjectExist, (req, res) => {
    const { id } = req.params;

    const projectIdex = projects.findIndex(p => p.id === id);

    projects.splice(projectIdex, 1);

    return res.send();
});

/**
 * Cadastrar as Tarefas.
 * 
 * Para acessar.
 * 2 é exemplo de tarefa já cadastrada.
 * Acess - http://localhost:3000/projects/2/tasks/
 */

 server.post('/projects/:id/tasks', checkProjectExist, (req, res) => {
     const { id } = req.params;
     const { title } = req.body;

     const project = projects.find(p => p.id === id);

     project.tasks.push(title);

     return res.json(project);
 });

server.listen(3000);