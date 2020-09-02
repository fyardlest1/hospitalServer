const express = require('express');
const bodyParser = require("body-parser");
const Contact = require("../models/contact-form-model");

const contactRouter = express.Router();

contactRouter.use(bodyParser.json());

contactRouter.route('/')
  .get((req, res, next) => {
    Contact.find()
      .then((hospital) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(hospital);
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Hospital.create(req.body)
      .then((hospital) => {
        console.log("Hospital Created", hospital);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(hospital);
      })
      .catch((err) => next(err));
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



module.exports = contactRouter;