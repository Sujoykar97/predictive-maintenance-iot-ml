const express = require('express');
const router = express.Router();
const service = require('../services/dataService');

router.post('/add',addUser)
router.get('/get',getUsers)

router.get('/read',getData)
router.post('/write',addData)


async function addData(req, res) {
    await service.addData(req.body.current,req.body.power);
    res.send("Updated")
}

async function getData(req, res) {

    var data = await service.getData();
    res.status(200).json(data)
}
async function addUser(req, res) {
    await service.addUser(req.body.name,req.body.email,req.body.pass);
    res.send("Updated")
}

async function getUsers(req, res) {

    var data = await service.getUsers();
    res.status(200).json(data)
}



module.exports = router;