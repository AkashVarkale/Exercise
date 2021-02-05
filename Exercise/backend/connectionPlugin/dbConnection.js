const knex = require('knex');

/**
 * Get the connection instance for the database.
 */
module.exports = {

	connect: () => {
		return knex({
			client: 'mysql',
			connection: {
				host: 'databsehost',
				port: 'portnumber',
				user: 'databseUserName',
				password: 'datbasePassword',
				database: 'databseName'
			},
			pool: { min: 2, max: 20 }
		});
	}
}
