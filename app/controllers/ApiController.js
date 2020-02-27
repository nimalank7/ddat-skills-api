const scraper = require('../services/SkillsScraperService');
const csvBuilder = require('../services/SkillsCsvService');

class ApiController {

  getAllSkills(flattern = false) {
    return scraper.getSkillsForFamily("Technical", "https://www.gov.uk/guidance/software-developer", flattern);
  }

  getAllSkillsCsv() {
    return scraper.getSkillsForFamily("Technical", "https://www.gov.uk/guidance/software-developer", true).then( data => {
      return new Promise(resolve => resolve(csvBuilder.buildCSV(data)));
    })
  }
}

module.exports = new ApiController()