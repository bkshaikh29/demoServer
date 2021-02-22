import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import uuid from 'uuid';

var fakeUser = [{
    id: 'ae06181d-92c2-4fed-a29d-fb53a6301eb9',
    userName: 'admin',
    password: 'admin'
}]

var fakeMembers = [{
    id: 'ae06181d-92c2-4fed-a29d-fb53a6301eb9',
    key: 'ae06181d-92c2-4fed-a29d-fb53a6301eb9',
    memberName: 'Member 1',
    memberAge: 32,
    address: 'Address 1',
    createdAt: new Date(),
}, {
    id: 'cda9165d-c263-4ef6-af12-3f1271af5fb4',
    key: 'cda9165d-c263-4ef6-af12-3f1271af5fb4',
    memberName: 'Member 2',
    memberAge: 33,
    address: 'Address 2',
    createdAt: new Date(Date.now() - 86400000 * 7),
}, {
    id: '2e538cc5-b734-4771-a109-dfcd204bb38b',
    key: '2e538cc5-b734-4771-a109-dfcd204bb38b',
    memberName: 'Member 3',
    memberAge: 33,
    address: 'Address 3',
    createdAt: new Date(Date.now() - 86400000 * 14),
}];

var fakeTodos = [{
    id: 'ae06181d-92c2-4fed-a29d-fb53a6301eb9',
    text: 'Learn about React Ecosystems',
    isCompleted: false,
    createdAt: new Date(),
}, {
    id: 'cda9165d-c263-4ef6-af12-3f1271af5fb4',
    text: 'Get together with friends',
    isCompleted: false,
    createdAt: new Date(Date.now() - 86400000 * 7),
}, {
    id: '2e538cc5-b734-4771-a109-dfcd204bb38b',
    text: 'Buy groceries',
    isCompleted: true,
    createdAt: new Date(Date.now() - 86400000 * 14),
}];

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/login/:userName/:password', (req, res) => {
    const { userName } = req.params;
    const { password } = req.params;
    const matchingUser = fakeUser.find(user => user.userName === userName);
    if (matchingUser != undefined && matchingUser != "") {
        if (password == "" || matchingUser.password != password) {
            res.status(400).json({ message: 'Enter Correct Password' });
        } else {
            res.status(200).json(matchingUser);
        }
    } else {
        res.status(400).json({ message: 'There is no user with such userName' });
    }
});

app.get('/members', (req, res) => {
    res.status(200).json(fakeMembers);
});

// add member 
app.post('/members', (req, res) => {
    const { member } = req.body;
    if (member) {
        const uuId = uuid();
        const insertedMember = {
            id: uuId,
            key: uuId,
            memberName: member.memberName,
            memberAge: member.memberAge,
            address: member.address,
            createdAt: Date.now(),
        }
        fakeMembers.push(insertedMember);
        res.status(200).json(insertedMember);
    } else {
        res.status(400).json({ message: 'Request body should have a member property' });
    }
});
// get single member 
app.get('/members/:id', (req, res) => {
    debugger
    const { id } = req.params;
    const fetchMember = fakeMembers.find(todo => todo.id === id);
    res.status(200).json(fetchMember);
});

// update single member 
app.post('/members/:id', (req, res) => {
    const { id } = req.params;
    const { member } = req.body;
    const matchingMember = fakeMembers.find(member => member.id === id);
    //const matchingTodo = fakeTodos.find(todo => todo.id === id);
    const updatedMember = {
        ...matchingMember,
        memberName: member.memberName,
        memberAge: member.memberAge,
        address: member.address,
    }
    if (updatedMember) {
        fakeMembers = fakeMembers.map(todo =>
            todo.id === id
                ? updatedMember
                : todo);
        res.status(200).json(updatedMember);
    } else {
        res.status(400).json({ message: 'There is no todo with that id' });
    }
});

app.delete('/members/:id', (req, res) => {
    debugger
    const { id } = req.params;
    const removedMember = fakeMembers.find(todo => todo.id === id);
    fakeMembers = fakeMembers.filter(todo => todo.id !== id);
    res.status(200).json(removedMember);
});

// The route for getting a list of all todos
app.get('/todos', (req, res) => {
    res.status(200).json(fakeTodos);
});

// The route for getting a list of all todos, but with a delay
// (to display the loading component better)
app.get('/todos-delay', (req, res) => {
    setTimeout(() => res.status(200).json(fakeTodos), 2000);
});

// The route for creating new todo-list items
app.post('/todos', (req, res) => {
    const { text } = req.body;
    if (text) {
        const insertedTodo = {
            id: uuid(),
            createdAt: Date.now(),
            isCompleted: false,
            text,
        }
        fakeTodos.push(insertedTodo);
        res.status(200).json(insertedTodo);
    } else {
        res.status(400).json({ message: 'Request body should have a text property' });
    }
});

app.post('/todos/:id/completed', (req, res) => {
    const { id } = req.params;
    const matchingTodo = fakeTodos.find(todo => todo.id === id);
    const updatedTodo = {
        ...matchingTodo,
        isCompleted: true,
    }
    if (updatedTodo) {
        fakeTodos = fakeTodos.map(todo =>
            todo.id === id
                ? updatedTodo
                : todo);
        res.status(200).json(updatedTodo);
    } else {
        res.status(400).json({ message: 'There is no todo with that id' });
    }
})

// The route for deleting a todo-list item
app.delete('/todos/:id', (req, res) => {
    debugger
    const { id } = req.params;
    const removedTodo = fakeTodos.find(todo => todo.id === id);
    fakeTodos = fakeTodos.filter(todo => todo.id !== id);
    res.status(200).json(removedTodo);
});

app.listen(8080, () => console.log("Server listening on port 8080"));
