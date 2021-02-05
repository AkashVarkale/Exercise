
module.exports = {
	//function to send email to the user on create, update or cancel of an appointmnet
	sendEmailNotification : async(data) => {
		var nodemailer = require('nodemailer');

		var transporter = nodemailer.createTransport({
		  service: 'gmail',
		  auth: {
		    user: 'sender@gmail.com',
		    pass: 'password'
		  }
			// host: "localhost", //Host
	    // port: 3000, // Port
	    // secure: true
		});

		var mailOptions = {
		  from: 'sender@gmail.com',
		  to: data.email,
		  subject: data.subject,
		  text: 'Please contact us at xxxxxxxxxx for further queries'
		};

		transporter.sendMail(mailOptions, function(error, info){
		  if (error) {
		    console.log(error);
				return 0;
		  } else {
		    console.log('Email sent: ' + info.response);
				return 1;
		  }
		});
	}
}
