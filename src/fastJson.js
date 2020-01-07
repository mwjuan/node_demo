const fastJson = require('fast-json-stringify')

const JSON = {
	objectify: fastJson({
		title: 'object Example',
		type: 'object',
		properties: {
			firstName: {
				type: 'string'
			},
			lastName: {
				type: 'string'
			},
			age: {
				type: 'integer'
			}
		}
	}),
	arrayify: fastJson({
		title: 'array Example',
		type: 'array',
		items: {
			properties: {
				firstName: {
					type: 'string'
				},
				lastName: {
					type: 'string'
				},
				age: {
					type: 'integer'
				}
			}
		}
	})
}

module.exports = JSON;