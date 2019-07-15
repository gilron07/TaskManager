var express = require("express");
var router = express.Router();

const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

var Project = require('../server/models/project');
// var Project = mongoose.model('Project');

/* Get all projects */
router.get('/', function (req, res, next) {
    Project.find({}, (err, projects) => {
        res.send({
            count: projects.length,
            projects: projects
        });
    })
});

/* Edit project */
router.put('/:projectId', (req, res) => {
    Project.findById(req.params.projectId)
        .then(project => {
            if(!project)
                return res.status(404).json({
                    message: "Project not found"
                })
            
        })
});

/* Add new project */
router.post('/', (req, res) => {
    // verfiy user
    User.findById(req.session.passport)
        .then(user => {
            if (!user)
                return res.status(404).json({
                    message: "User not found"
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

    Project.find({ serialNumber: req.body.serialNumber })
        .then(project => {
            if (project.length > 0)
                return res.status(500).json({
                    message: "Serial number already exist"
                });
            else {
                const project = new Project({
                    serialNumber: req.body.serialNumber,
                    createdBy: req.session.passport.id,
                    goosh: req.body.goosh,
                    helka: req.body.helka,
                    address: {
                        city: req.body.address.city,
                        streetName: req.body.address.streetName,
                        houseNumber: req.body.address.houseNumber,
                        zip: req.body.address.zip
                    }
                });
                return project.save();
            }
        })
        .then(result => {
            return res.status(201).json({
                message: "Project was successfully created",
                project: result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

/* Edit Project */

/* update manual edit for a single project*/
router.put("/:projectId/timings/:timingId", function (req, res, next) {
    Project.findOneAndUpdate({ _id: req.params.projectId, 'timing._id': req.params.timingId },
        {
            $push: {
                'timing.$.manualEdits': {
                    userId: new ObjectId("5d23c2de6b6747e446c2c225"),
                    timestamp: Date.now()
                }
            }
        })
        .then(res => {
            console.log(res);
        })
});

module.exports = router;