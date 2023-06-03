import Skill from "../../models/SkillModel";

class SkillService {
  async searchSkill(keyword) {
    const skills = await Skill.aggregate([
      {
        $search: {
          index: "searchskill",
          autocomplete: {
            query: keyword,
            path: "name",
          },
        },
      },
    ])
      .sort({ star: -1 })
      .limit(10);
    return skills;
  }
}

export default new SkillService();
