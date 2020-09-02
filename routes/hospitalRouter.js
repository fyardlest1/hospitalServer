const express = require("express");
const bodyParser = require("body-parser");
const Hospital = require('../models/hospital-model');
const { response } = require("../app");

const hospitalRouter = express.Router();

hospitalRouter.use(bodyParser.json());

hospitalRouter
  .route("/")
  .get((req, res, next) => {
    Hospital.find()
    .then(hospital => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(hospital);
    })
    .catch(err => next(err));
  })
  .post((req, res, next) => {
    Hospital.create(req.body)
    .then(hospital => {
      console.log('Hospital Created', hospital);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(hospital);
    })
    .catch(err => next(err));
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /hospitals");
  })
  .delete((req, res, next) => {
    Hospital.deleteMany()
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((err) => next(err));
  });

// Routing the hospital Id
hospitalRouter.route("/:hospitalId")
  .get((req, res, next) => {
    Hospital.findById(req.params.hospitalId)
      .then((hospital) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(hospital);
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /hospitals/${req.params.hospitalId}`
    );
  })
  .put((req, res, next) => {
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
.delete((req, res, next) => {
    Hospital.findByIdAndDelete(req.params.hospitalId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = hospitalRouter;