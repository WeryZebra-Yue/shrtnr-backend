import * as express from "express";
import controller from "./controller";
import isAuthenticated from "../../middlewares/isAuthenticated.jwt";

export default express.Router().get("/searchSkill", controller.searchSkill);
