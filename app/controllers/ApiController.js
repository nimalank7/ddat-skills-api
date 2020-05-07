const scraper = require('../services/SkillsScraperService');
const csvBuilder = require('../services/SkillsCsvService');

class ApiController {

  getAllSkills(flattern = false) {
    return scraper.getSkillsForFamily("Technical", "https://www.gov.uk/guidance/software-developer", flattern);
  }

  getAllSkillsFamily() {
    return scraper.getSkillsForAllFamilies("https://www.gov.uk/government/collections/digital-data-and-technology-profession-capability-framework");
  }

  getAllSkillsCsv() {
    return scraper.getSkillsForFamily("Technical", "https://www.gov.uk/guidance/software-developer", true).then( data => {
      return new Promise(resolve => resolve(csvBuilder.buildCSV(data)));
    })

    // Presumably store the initial getSkillsForFamily in a variable then append the getAllSkillsFamily etc... then we can call .then etc...
  }

  getAllSkillsForTableView() {
    return scraper.getSkillsForFamily("Technical", "https://www.gov.uk/guidance/software-developer", true).then( data => {
      return new Promise(resolve => {
        resolve( {
          headers: Object.keys(data[0]).map( (key) => ( { text: key } ) ),
          rows: data.map( (row) => {
            return Object.keys(row).map( (key) => ( { text: row[key] } ))
          })
        });
      });
    })
  }
}

module.exports = new ApiController()