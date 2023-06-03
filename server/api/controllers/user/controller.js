import userService from "../../services/user.service";
import l from "../../../common/logger";
import authenticationService from "../../services/authentication.service";

export class Controller {
  async getuser(req, res) {
    try {
      const userId = req.user.id;
      const user = await userService.getuser(userId);
      res.status(200).json(user);
    } catch (err) {
      l.error(err, "GET USER CONTROLLER ERROR");
    }
  }
  async addopening(req, res) {
    try {
      const userId = req.user.id;
      const opening = req.body;
      const user = await userService.addopening(userId, opening);
      res.status(200).json(user);
    } catch (err) {
      l.error(err, "ADD OPENING CONTROLLER ERROR");
    }
  }
  async getopening(req, res) {
    try {
      const userId = req.user.id;
      const openingid = req.query.id;
      const opening = await userService.getopening(userId, openingid);
      res.status(200).json(opening);
    } catch (err) {
      l.error(err, "GET OPENING CONTROLLER ERROR");
    }
  }
  async getopenings(req, res) {
    try {
      const userId = req.user.id;
      const openings = await userService.getopenings(userId);
      res.status(200).json(openings);
    } catch (err) {
      l.error(err, "GET OPENINGS CONTROLLER ERROR");
    }
  }
  async deleteopening(req, res) {
    try {
      const userId = req.user.id._id;
      const id = req.query.id;
      console.log(userId, id);
      await userService.deleteopening(userId, id);
      res.status(200).json({
        message: "Opening deleted successfully",
      });
    } catch (err) {
      l.error(err, "DELETE OPENING CONTROLLER ERROR");
    }
  }
}
export default new Controller();
