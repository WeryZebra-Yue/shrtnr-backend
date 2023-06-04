import * as express from "express";
import controller from "./controller";
import isAuthenticated from "../../middlewares/isAuthenticated.jwt";

export default express
  .Router()
  .post("/add-url", isAuthenticated, controller.addUrl)
  .get("/get-url", isAuthenticated, controller.getUrl)
  .post("/delete-url", isAuthenticated, controller.deleteUrl)
  .post("/update-url", isAuthenticated, controller.updateUrl)
  .get("/redirect-url/:shorturl", controller.redirectUrl);
// .get("/get-all-url", isAuthenticated, controller.getAllUrl);
