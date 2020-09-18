var express = require("express");
var router = express.Router();

var Project = require('../server/models/project');
var { isLoggedIn, isAdmin } = require('../server/middlewares');

/* Add new status to project*/
router.put('/', isLoggedIn, (req, res) => {
    Project.findById(req.projectId)
        .then(project => {
            // verify user has permission to edit project
            if (!req.user.is_admin && project.assignedUser != req.user.id) {
                return res.status(401).json({
                    message: "User has no permission to edit current project"
                });
            }

            if (req.body.state == 'USER_CHANGE'){
                project.assignedUser = req.body.changedUser;
            }
            project.status.push({
                userId: req.user.id,
                state: req.body.state
            });

            return project.save();
        })
        .then(() => {
            return res.status(200).send({
                message: "Project's state was successfully updated"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: err
            });
        });
});

/* Add manual projects to a certain timing in a project */


module.exports = router;