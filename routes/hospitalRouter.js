const express = require("express");
const bodyParser = require("body-parser");

const hospitalRouter = express.Router();

hospitalRouter.use(bodyParser.json());

hospitalRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res) => {
    res.end("Will send all the hospitals to you");
  })
  .post((req, res) => {
    res.end(
      `Will add the hospital: ${req.body.name} with description: ${req.body.description}`
    );
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /hospitals");
  })
  .delete((req, res) => {
    res.end("Deleting all hospitals");
  });

// Routing the hospital Id
hospitalRouter.route("/:hospitalId")
  .get((req, res) => {
    res.end(
      `Will send details of the hospital: ${req.params.hospitalId} to you`
    );
  })
  .post((req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /hospitals/${req.params.hospitalId}`
    );
  })
  .put((req, res) => {
    res.write(`Updating the hospital: ${req.params.hospitalId}\n`);
    res.end(`Will update the hospital: ${req.body.name}
        with description: ${req.body.description}`);
  })
  .delete((req, res) => {
    res.end(`Deleting hospital: ${req.params.hospitalId}`);
  });

module.exports = hospitalRouter;