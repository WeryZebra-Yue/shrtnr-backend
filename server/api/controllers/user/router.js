import * as express from "express";
import controller from "./controller";
import isAuthenticated from "../../middlewares/isAuthenticated.jwt";

export default express
  .Router()
  .get("/getuser", isAuthenticated, controller.getuser)
  .post("/add-opening", isAuthenticated, controller.addopening)
  .get("/get-openings", isAuthenticated, controller.getopenings)
  .get("/get-opening", isAuthenticated, controller.getopening)
  .post("/delete-opening", isAuthenticated, controller.deleteopening);
