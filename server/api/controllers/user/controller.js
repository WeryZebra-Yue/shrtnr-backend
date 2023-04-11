import userService from "../../services/user.service";
import l from "../../../common/logger";
import authenticationService from "../../services/authentication.service";

export class Controller {
  async getuser(req, res) {
    try {
      const user_id = req.user.id;
      const user = await userService.getuser(user_id);
      res.status(200).json(user);
    } catch (err) {
      l.error(err, "GET USER CONTROLLER ERROR");
    }
  }
}
export default new Controller();
