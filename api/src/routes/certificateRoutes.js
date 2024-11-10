
const express = require('express');


const router = express.Router();


const certificateController = require('../controllers/certificateController');



router.post('/api/v1/certificate', certificateController.createCertificate);


module.exports = router;
