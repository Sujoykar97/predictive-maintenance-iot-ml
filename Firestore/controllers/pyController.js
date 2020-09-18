const express = require('express');
const router = express.Router();
const pyService = require('./../services/pyService');

router.get('/py',pyRun)
function pyRun(req, res) {

    pyService.pyRun(function(result) { res.send(result) });
    

}

module.exports = router;