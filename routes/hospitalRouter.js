const express = require("express");
const bodyParser = require("body-parser");
const Hospital = require('../models/hospital-model');
const { response } = require("../app");
const authenticate = require("../authenticate");

const hospitalRouter = express.Router();

hospitalRouter.use(bodyParser.json());

hospitalRouter
  .route("/")
  .get((req, res, next) => {
    Hospital.find()
      .then((hospital) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(hospital);
      })
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Hospital.create(req.body)
      .then((hospital) => {
        console.log("Hospital Created", hospital);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(hospital);
      })
      .catch((err) => next(err));
  })
  .put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /hospitals");
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Hospital.deleteMany()
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((err) => next(err));
  });

// Routing the hospital Id
hospitalRouter
  .route("/:hospitalId")
  .get((req, res, next) => {
    Hospital.findById(req.params.hospitalId)
      .then((hospital) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(hospital);
      })
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /hospitals/${req.params.hospitalId}`
    );
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    Hospital.findByIdAndUpdate(
      req.params.hospitalId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then((hospital) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(hospital);
      })
      .catch((err) => next(err));
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Hospital.findByIdAndDelete(req.params.hospitalId)
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((err) => next(err));
  });

// Handle user comments: 
hospitalRouter
  .route("/:hospitalId/comments")
  .get((req, res, next) => {
    Hospital.findById(req.params.hospitalId)
      .then((hospital) => {
        if (hospital) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(hospital.comments);
        } else {
          err = new Error(`hospital ${req.params.hospitalId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Hospital.findById(req.params.hospitalId)
      .then((hospital) => {
        if (hospital) {
          hospital.comments.push(req.body);
          hospital
            .save()
            .then((hospital) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(hospital);
            })
            .catch((err) => next(err));
        } else {
          err = new Error(`hospital ${req.params.hospitalId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(
      `PUT operation not supported on /hospitals/${req.params.hospitalId}/comments`
    );
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Hospital.findById(req.params.hospitalId)
      .then((hospital) => {
        if (hospital) {
          for (let i = hospital.comments.length - 1; i >= 0; i--) {
            hospital.comments.id(hospital.comments[i]._id).remove();
          }
          hospital
            .save()
            .then((hospital) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(hospital);
            })
            .catch((err) => next(err));
        } else {
          err = new Error(`hospital ${req.params.hospitalId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  });

  // Handle user commentId
hospitalRouter
  .route("/:hospitalId/comments/:commentId")
  .get((req, res, next) => {
    Hospital.findById(req.params.hospitalId)
      .then((hospital) => {
        if (hospital && hospital.comments.id(req.params.commentId)) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(hospital.comments.id(req.params.commentId));
        } else if (!hospital) {
          err = new Error(`hospital ${req.params.hospitalId} not found`);
          err.status = 404;
          return next(err);
        } else {
          err = new Error(`Comment ${req.params.commentId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /hospitals/${req.params.hospitalId}/comments/${req.params.commentId}`
    );
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    Hospital.findById(req.params.hospitalId)
      .then((hospital) => {
        if (hospital && hospital.comments.id(req.params.commentId)) {
          if (req.body.rating) {
            hospital.comments.id(req.params.commentId).rating = req.body.rating;
          }
          if (req.body.text) {
            hospital.comments.id(req.params.commentId).text = req.body.text;
          }
          hospital
            .save()
            .then((hospital) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(hospital);
            })
            .catch((err) => next(err));
        } else if (!hospital) {
          err = new Error(`hospital ${req.params.hospitalId} not found`);
          err.status = 404;
          return next(err);
        } else {
          err = new Error(`Comment ${req.params.commentId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Hospital.findById(req.params.hospitalId)
      .then((hospital) => {
        if (hospital && hospital.comments.id(req.params.commentId)) {
          hospital.comments.id(req.params.commentId).remove();
          hospital
            .save()
            .then((hospital) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(hospital);
            })
            .catch((err) => next(err));
        } else if (!hospital) {
          err = new Error(`hospital ${req.params.hospitalId} not found`);
          err.status = 404;
          return next(err);
        } else {
          err = new Error(`Comment ${req.params.commentId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  });

module.exports = hospitalRouter;