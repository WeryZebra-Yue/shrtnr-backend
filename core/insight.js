const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

const getInsight = async (skills, context) => {
  skills = `{${skills.join(":%,")},summary:15words}`;
  context = context ? `context[${context}]` : "";

  try {
    const response = await openai.createChatCompletion({
      top_p: 0,
      model: process.env.OPENAI_MODEL,
      temperature: 0,
      messages: [
        {
          role: "user",
          content: ` rules: you need to provide percentage in numeric based on compatibility using context,provide zero if no context is provided,provide json and put it in single string nothing else,don't break any rule.${context}:\n${skills}:%`,
        },
      ],
    });

    const result = response.data.choices[0].message.content;
    console.log(result);

    try {
      console.log(JSON.parse(result));

      return JSON.parse(result);
    } catch (err) {
      let skills_insight = result
        .split(`summary:`)[0]
        .concat("}")
        .replaceAll("\n' +", "")
        .replaceAll(",", ',"')
        .replaceAll(":", '":')
        .replaceAll("{", '{"')
        .replaceAll(',"}', "}")
        .replaceAll("%", "");

      const summary = result?.split(`summary:"`)[1].split(`}`)[0];

      skills_insight = JSON.parse(skills_insight);
      Object.keys(skills_insight).forEach((key) => {
        const str = skills_insight[key];
        if (typeof str === "string")
          if (str.includes("%")) {
            skills_insight[key] = parseInt(skills_insight[key].split("%")[0]);
          }
      });
      skills_insight.summary = summary;

      console.log(skills_insight);

      return skills_insight;
    }
  } catch (err) {
    console.log("error in getInsight");
    console.log(err, err.response.data);
    return err;
  }
};
module.exports = getInsight;
