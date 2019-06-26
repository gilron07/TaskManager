// User
{
	"_id": 123123123,
	"username": "cool_gilron",
	"firstname": "gilron",
	"lastname": "Tsabkevich",
	"password": "****",
	"is_admin": false,
	"saved_searches": [
		{
			"user_query": "BORDERS"
			"db_query": "db.projects.find({'timing.state': 'BORDERS'});"
		}
	]
}
// Project
{
	// "_id": 123123123,
	"serialNumber": "2019-43",
	"creation_timestamp": "2019-06-25 08:43:21 +03:00",
	"created_by": 123123123, // User Id
	"gush": 6948,
	"helka": "80",
	"address": {
		"city": "Petah Tikva",
		"street_name": "Kaplansky",
		"house_number": 41,
	}
	"timing": [
		{
			"user_id": 123123123,
			"timestamp": "2019-06-26 08:00:00 +03:00",
			"state": "IN_PROGRESS",
		},
		{
			"user_id": 123123123,
			"timestamp": "2019-06-26 09:00:00 +03:00",
			"state": "PAUSE",
			"manual_edit": [
				{
					"user_id": 123123123,
					"timestamp": "2019-06-26 08:55:00 +03:00",
				}
			]
		},
		{
			"user_id": 123123123,
			"timestamp": "2019-06-26 09:30:00 +03:00",
			"state": "IN_PROGRESS",
		},
		{
			"user_id": 123123123,
			"timestamp": "2019-06-26 10:00:00 +03:00",
			"state": "BORDERS",
		},
		{
			"user_id": 123123123,
			"timestamp": "2019-06-30 07:00:00 +03:00",
			"state": "PAUSE",
		},
	]
}