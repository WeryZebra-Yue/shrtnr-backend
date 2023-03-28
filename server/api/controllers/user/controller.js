import userService from "../../services/user.service";
import l from "../../../common/logger";
import authenticationService from "../../services/authentication.service";

export class Controller {
  async getuser(req, res) {
    try {
      // working here
      res.send(req.user);
    } catch (err) {
      l.error(err, "GET USER CONTROLLER ERROR");
    }
  }
}
export default new Controller();
