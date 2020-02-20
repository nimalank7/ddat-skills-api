const scraper = require('../services/SkillsScraperService');
const csvBuilder = require('../services/SkillsCsvService');

class ApiController {

  getAllSkills() {
    return scraper.getSkillsForFamily();
  }

  getAllSkillsCsv() {
    return scraper.getSkillsForFamily().then( data => {
      return new Promise(resolve => resolve(csvBuilder.buildCSV(data)));
    })
  }
}

module.exports = new ApiController()