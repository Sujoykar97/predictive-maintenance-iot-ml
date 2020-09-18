var express = require('express');
var router = express.Router();

router.use('/data', require('../controllers/dataController'))
router.use('/python', require('../controllers/pyController'))

module.exports = router;