var express = require("express");
var router = express.Router();
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;


var { removeEmpty } = require('../server/utils');
var { isLoggedIn } = require('../server/middlewares');

var Project = require('../server/models/project');
var statusesRouter = require('./statuses');

/* Get all projects */
router.get('/', isLoggedIn, function (req, res, next) {
    Project.find({}, (err, projects) => {
        res.send({
            count: projects.length,
            projects: projects
        });
    })
});

/* Edit project */
router.put('/:projectId', isLoggedIn, (req, res) => {
    Project.findById(req.params.projectId)
        .then(project => {
            if (!project) {
                return res.status(404).json({
                    message: "Project not found"
                });
            }
            // prevent from updating unwanted fields
            delete req.body.createdBy;
            delete req.body.creationDate;

            removeEmpty(req.body);
            Object.assign(project, req.body);

            return project.save();
        })
        .then(() => {
            return res.status(200).send({
                message: "Project was successfully updated"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: err
            });
        });
});

/* Delete project */
router.delete('/:projectId', isLoggedIn, (req, res) => {
    Project.findById(req.params.projectId)
        .then(project => {
            if (!project)
                return res.status(404).json({
                    message: "Project nor foud"
                });

            project.isDeleted = true;
            return project.save();
        })
        .then(() => {
            return res.status(200).json({
                message: "Project is deleted"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: err
            });
        });
});

/* Add new project */
router.post('/', isLoggedIn, (req, res) => {
    Project.find({ serialNumber: req.body.serialNumber })
        .then(project => {
            if (project.length > 0)
                return res.status(500).json({
                    message: "Serial number already exist"
                });
            else {
                var { serialNumber, goosh, helka, address, tags } = req.body;
                var createdBy = assignedUser = req.user.id;
                const project = new Project({
                    serialNumber, goosh, helka, address, tags, createdBy, assignedUser
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

/* Timings route */
router.use('/:projectId/statuses', function (req, res, next) {
    req.projectId = req.params.projectId;
    next();
}, statusesRouter);

module.exports = router;