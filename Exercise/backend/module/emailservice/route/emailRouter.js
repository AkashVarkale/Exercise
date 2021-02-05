var express = require ('express');
var emailServiceController = require('../controller/emailServiceController');

const router = express.Router();

router.route('/list')
    .all(emailServiceController.getAllAppointments); // Route to fetch all the appointment
router.route('/scheduleAppointment')
    .all(emailServiceController.scheduleAppointment); // Route to schedule an appointment
router.route('/updateAppointment')
    .all(emailServiceController.updateAppointment); // Route to update an appointment
router.route('/cancelAppointment')
    .all(emailServiceController.cancelAppointment); // Route to cancel an appointment

module.exports = router;
