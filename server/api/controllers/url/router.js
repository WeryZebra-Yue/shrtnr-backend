import * as express from "express";
import controller from "./controller";
import isAuthenticated from "../../middlewares/isAuthenticated.jwt";

export default express
  .Router()
  .post("/add", isAuthenticated, controller.addUrl)
  .post("/delete", isAuthenticated, controller.deleteUrl)
  .post("/update", isAuthenticated, controller.updateUrl)
  .get("/get", isAuthenticated, controller.getUrl)
  .get("/get-analytics", isAuthenticated, controller.getAnalytics)
  .get("/redirect/:shorturl", controller.redirectUrl);

// .get("/get-all-url", isAuthenticated, controller.getAllUrl);
