var express = require('express');

var app = express();
var router = express.Router();

var index = require('../app/controllers');
var log = require('../app/controllers/log');

router.get('/', index.index);
router.get('/description', index.description);
router.post('/log/load', log.load);
router.post('/log/save', log.save);
router.post('/log/jump', log.jump);

module.exports = router;