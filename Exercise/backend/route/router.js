var express = require ('express');
var emailRouter = require('../module/emailservice/route/emailRouter');

const router = express.Router();


router.use('/emailService', emailRouter); // Route to redirect routes with /user

module.exports = router;
