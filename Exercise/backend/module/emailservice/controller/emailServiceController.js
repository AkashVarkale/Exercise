const emailService = require('../../emailservice/model/emailService');
const appointment = require('../../emailservice/model/appointment');

module.exports = {

	/**
		*Method to fetch list of users from database
		*@param {formdata}} req
		*@param {json} res
		*
		* @return json
	*/
	getAllAppointments: async (req, res, next) => {
		try {
			var appointmentDetails = await appointment.fetchAll();
			for (let i = 0; i < appointmentDetails.length; i++) {
				switch(appointmentDetails[i].status){
					case 0:
						appointmentDetails[i].appointmentStatus = "Active";
						break;
					case 1:
						appointmentDetails[i].appointmentStatus = "Inactive";
						break;
					case 2:
							appointmentDetails[i].appointmentStatus = "Cancelled";
							break;
					default:
							appointmentDetails[i].appointmentStatus = appointmentDetails[i].status;
							break;
				}
			}
			res.status(201).json({ code: 201, status: true, msg: "Success", data: appointmentDetails });
		} catch (err) {
			res.status(500).json({ code: 500, status: false, msg: err });
		}
	},

	/**
	  *Method toschedule an appointment
	  *@param {formdata}} req
	  *@param {json} res
	  *
	  * @return json
	*/
	scheduleAppointment : async (req, res, next) => {
		try {
			var data = {
					name: (req.body.name) ? (req.body.name).trim().toLowerCase() : "",
					email: (req.body.email) ? (req.body.email).trim().toLowerCase() : "",
					contactNumber: (req.body.contactNumber) ? (req.body.contactNumber) : "",
					status: (req.body.status) ? (req.body.status) : 0,
					startTime : (req.body.startTime) ? (req.body.startTime) : "",
					endTime : (req.body.endTime) ? (req.body.endTime) : ""
				};
				var checkIfEmail = await appointment.checkIfEmailExists(data.email);
				if(checkIfEmail.length){
					res.status(203).json({code: 203, status: false, msg: "Email already exists"});
				}else{
					var lastInsertedValue = await appointment.saveAppointmentDetails(data);
					if(lastInsertedValue || lastInsertedValue.length){
						//Send an email to the user once he schedules appointment
						var emailData = {
							email: data.email,
							subject: "Dear " + data.name + " your appointment is scheduled between " + data.startTime + "and " + data.endTime
						};
						var status = await emailService.sendEmailNotification(emailData);
						if(!status){
							res.status(203).json({code: 203, status: false, msg: "Something when wrong please try again later!!!!"});
						}
						res.status(200).json({ code: 200, status: true, msg: "Appointment scheduled Successfully" });
					}
				}
		} catch (err) {
			res.status(500).json({ code: 500, status: false, msg: err });
		}
	},

	/**
	  *Method to update an appointment
	  *@param {formdata}} req
	  *@param {json} res
	  *
	  * @return json
	*/
	updateAppointment : async (req, res, next) => {
		try {
			var data = {
					name: (req.body.name) ? (req.body.name).trim().toLowerCase() : "",
					email: (req.body.email) ? (req.body.email).trim().toLowerCase() : "",
					contactNumber: (req.body.contactNumber) ? (req.body.contactNumber) : "",
					status: (req.body.status) ? (req.body.status) : 0,
					startTime : (req.body.startTime) ? (req.body.startTime) : "",
					endTime : (req.body.endTime) ? (req.body.endTime) : ""
				};
				var checkIfEmail = await appointment.checkIfEmailExists(data.email);
				if(checkIfEmail.length){
					data.appointmentId = checkIfEmail[0].appointmentId;
					var lastInsertedValue = await appointment.saveAppointmentDetails(data);
					if(lastInsertedValue){
						//Send an email to the user once he schedules appointment
						var emailData = {
							email: data.email,
							subject: "Dear " + data.name + " your appointment is scheduled between " + data.startTime + "and " + data.endTime
						};
						var status = await emailService.sendEmailNotification(emailData);
						res.status(200).json({ code: 200, status: true, msg: "Appointment updated Successfully" });
					}
				}else{
					res.status(203).json({code: 203, status: false, msg: "Email does not exists"});
				}
		} catch (err) {
			res.status(500).json({ code: 500, status: false, msg: err });
		}
	},

	/**
	  *Method to remove an appointment
	  *@param {formdata}} req
	  *@param {json} res
	  *
	  * @return json
	*/
	cancelAppointment : async (req, res, next) => {
		try {
				var appointmentId = (req.params.id) ? (req.params.id) : null;
				var appontment = await appointment.checkAppointmentExists(appointmentId);
				if(appontment.length){
					var data = {
							appointmentId : appointmentId,
							status : 2
						};
					//updating status of the appointment to 2 to cancel appointment, to have history of the appointments in db server
					var lastDeletedValue = await appointment.saveAppointmentDetails(data);
					if(lastDeletedValue){
						//Send an email to the user once he schedules appointment
						var emailData = {
							email: appontment[0].email,
							subject: "Your appointment has been cancelled"
						};
						var status = await emailService.sendEmailNotification(emailData);
						res.status(200).json({ code: 200, status: true, msg: "Appointment cancelled Successfully" });
					}
				}else{
					res.status(203).json({code: 203, status: false, msg: "Appointment is not registered"});
				}
		} catch (err) {
			res.status(500).json({ code: 500, status: false, msg: err });
		}
	}
}
