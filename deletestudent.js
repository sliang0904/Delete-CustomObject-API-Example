var APIBuilder = require('@axway/api-builder-runtime');

var DeleteAPI = APIBuilder.API.extend({
	group: 'student',
	path: '/api/student/delete',
	method: 'DELETE',
	description: "This is a API to delete spesific studnet by studentId",
	model: 'student',
	parameters: {
		studentId: { description: "the studnet id field for student object" }
	},
	action: function (req, res, next) {
		var queryParams = {
			where: {
				"studentId":req.params.studentId
			}
		}
		// query student by studentId field, then get object id
		req.server.getAPI('api/student/query', 'GET').execute(queryParams, function(err1, result1) {
			if (err1) {
				next(err1);
			} else {
				if(result1.students.length == 0) {
					req.log.info("Can not find this student.");
					// control the response error code and message
					var errorMessage = new Error('Student Not Found');
					errorMessage.status = 404;
					next(errorMessage);
				} else {
					req.log.info('got student ' + JSON.stringify(result1.students[0]));
					var objectId = result1.students[0].id;
					var deleteParams = {
						"id": objectId
					}
					// delete student object by object id, which returned from query step
					req.server.getAPI('api/student/:id', 'DELETE').execute(deleteParams, function(err2, result2) {
						if(err2) {
							next(err2);
						} else {
							req.log.info("student is deleted successfully");
							// overwrite sucess respones to 200 instand of 204
							res.send('sucess');
							next();
						}
					})
				}
			}
		});
	}
});

module.exports = DeleteAPI;