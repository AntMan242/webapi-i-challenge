import { Server } from "https";
import { setServers } from "dns";

const express = require('express');

// import DB helper functions/methods
const db = require('./data/db');

const server = express();

// Endpoints
server.get('/', (req, res) => {
    res.send('HI!');
})

server.get('/now', (req, res) => {
    const now = new Date().toISOString();
    res.send(now);
})

server.get('/users', (req, res) => {
    db.users
    .find()
    .then(users => {
        res.status(200).json(users)
    })
    .catch(({code, message}) => {
        res.status(code).json({success: false, message});
    })
});

server.get('/users/:id', (req, res) => {
    db.users
    .findById(req.params.id)
    .then(user => {
        if (user) {
            res.status(200).json({success: true, user});
        } else {
            res
                .status(404)
                .json({success: false, message: 'Cant find user by that id'});
        }
    })
    .catch(({code, message}) => {
        res.status(code).json({success: false, message});
    })
})

server.post('/users', (req, res) => {
    const userInfo = req.body;
    console.log('request body name', userInfo);

    db.users
    .add(userInfo)
    .then(user => {
        res.status(201).json({success: true, user});
    })
    .catch(({code, message}) => {
        res.status(code).json({success: false, message});
    })
})

server.delete('/users/:id', (req, res) => {
    const id = req.params.id;

    db.users
        .remove(id)
        .then(deleted => {
            res.status(204).end();
        })
        .catch(({code, message}) => {
            res.status(code).json({success: false, message});
        })
})

server.put('/users/:id', (req, res) => {
    const {id} = req.params;
    const changes = req.body;

    db.users
        .update(id, changes)
        .then(updated => {
            if (updated) {
                res.status(200).json({success: true, updated});
            } else {
                res
                    .status(404)
                    .json({success: false, message: 'Cannot find user updated' });
            }
        })
        .catch(({code, message}) => {
            res.status(code).json({success: false, message});
        })
})

// implement your API here
const PORT = process.env.PORT || 5000;

server.listen(5000, () => {

})