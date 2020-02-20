const { Parser } = require('json2csv');

const fields = [
  'job_family',
  'role',
  'role_level',
  'role_description_intro',
  'skills_they_need',
  'skill_name',
  'skill_description',
  'skill_level',
  'skill_level_description'
];
const opts = { fields };

class SkillsCsvService {
  buildCSV(data) {
    const json2csvParser = new Parser(opts);
    return json2csvParser.parse(this.format(data));
  }

  format(role) {
    var data = [];
    role.levels.forEach( level => {
      level.skills.forEach( skill => {
        data.push({
          job_family: role.family,
          role: role.title,
          role_level: level.title,
          role_description_intro: role.levels[0].description,
          skills_they_need: `${level.description}\n\n${level.duties_pretext}\n${level.duties.map(d => `- ${d}`).join('\n')}`,
          skill_name: skill.name,
          skill_description: skill.description,
          skill_level: skill.skill_level,
          skill_level_description: skill.skill_level_description
        });
      });
    });
    return data;
  }
}

module.exports = new SkillsCsvService()