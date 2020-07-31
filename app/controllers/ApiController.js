const scraper = require('../services/SkillsScraperService');
const csvBuilder = require('../services/SkillsCsvService');

class ApiController {

  // getAllSkills(flattern = false) {
  //   return scraper.getSkillsForFamily("Technical", "https://www.gov.uk/guidance/software-developer", flattern);
  // }

  getAllSkillsFamily() {
    return scraper.getSkillsForAllFamiliesFlattened("https://www.gov.uk/government/collections/digital-data-and-technology-profession-capability-framework");
  }

  // Used for downloading the full CSV
  
  getAllSkillsFamilyCsv() {
    return scraper.getSkillsForAllFamiliesFlattened("https://www.gov.uk/government/collections/digital-data-and-technology-profession-capability-framework").then( data => {
      return new Promise(resolve => resolve(csvBuilder.buildCSV(data)));
    })
  }

  // getAllSkillsCsv() {
  //   return scraper.getSkillsForFamily("Technical", "https://www.gov.uk/guidance/data-analyst", true).then( data => {
  //     return new Promise(resolve => resolve(csvBuilder.buildCSV(data)));
  //   })
  // }

  getAllSkillsForTableView() {
    return scraper.getSkillsForFamily("Technical", "https://www.gov.uk/guidance/service-designer", true).then( data => {
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