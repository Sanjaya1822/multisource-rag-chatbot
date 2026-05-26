const express = require('express');
const { listSources, removeSource } = require('../controllers/sourcesController');

const router = express.Router();

router.get('/sources', listSources);
router.delete('/source/:id', removeSource);

module.exports = router;
