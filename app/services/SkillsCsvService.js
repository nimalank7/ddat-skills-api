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
    return json2csvParser.parse(data);
  }
}

module.exports = new SkillsCsvService()