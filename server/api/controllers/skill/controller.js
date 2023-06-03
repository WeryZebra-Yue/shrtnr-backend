import l from "../../../common/logger";
import skillService from "../../services/skill.service";

export class Controller {
  async searchSkill(req, res) {
    try {
      const keyword = req.query.keyword;
      const skills = await skillService.searchSkill(keyword);
      res.status(200).json(skills);
    } catch (err) {
      l.error(err, "GET USER CONTROLLER ERROR");
    }
  }
}
export default new Controller();
