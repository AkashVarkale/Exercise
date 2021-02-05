const commonConnection = require('../../../connectionPlugin/dbConnection'); // To connect to the common shared database
module.exports = {
	//Check if the appointment with
	checkIfEmailExists : async(email) => {
		db = await commonConnection.connect();
		return await db.select('appointmentId','email').from('appointment').where({ email: email }).finally(() => db.destroy());
	},
	//save appointment details to the database
	saveAppointmentDetails : async(data, adv = null) => {
		db = await commonConnection.connect();
		if(data.appointmentId == null || !data.appointmentId){
			return await db('appointment').insert(data).then(appointment => appointment).finally(() => db.destroy());
		}else{
			return await db('appointment').update(data).where({ appointment: data.appointment }).finally(() => db.destroy());
		}
	},

  //check if appointment is registered to databse by id
	checkAppointmentExists : async(appointmentId) => {
    db = await commonConnection.connect();
		return await db.select('appointmentId').from('appointment').where({ appointmentId: appointmentId}).whereNot({status:2}).finally(() => db.destroy());
	},

  //fetch all appointments
	fetchAll: async () => {
		let db = await adapter();
		return await db.select('*').from('appointment').whereNot({ status: 3 }).finally(() => db.destroy()).finally(() => db.destroy());
	}

}
