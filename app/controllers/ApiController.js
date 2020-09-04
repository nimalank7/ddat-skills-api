const scraper = require('../services/SkillsScraperService');
const csvBuilder = require('../services/SkillsCsvService');

class ApiController {

  getAllSkillsFamily() {
    return scraper.getSkillsForAllFamiliesFlattened("https://www.gov.uk/government/collections/digital-data-and-technology-profession-capability-framework");
  }

  getAllSkillsFamilyCsv() {
    return scraper.getSkillsForAllFamiliesFlattened("https://www.gov.uk/government/collections/digital-data-and-technology-profession-capability-framework").then( data => {
      return new Promise(resolve => resolve(csvBuilder.buildCSV(data)));
    })
  }

  getAllSkillsForAllFamiliesTableView() {
    return scraper.getSkillsForAllFamiliesFlattened("https://www.gov.uk/government/collections/digital-data-and-technology-profession-capability-framework").then( data => {
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