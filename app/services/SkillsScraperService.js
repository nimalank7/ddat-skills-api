const cheerioReq = require("cheerio-req");

class SkillsScraperService {
  
  getSkillsForFamily(family, url, flattenData = false) {
    return new Promise(resolve => {
      cheerioReq(url, (err, $) => {
        let family_meta_data = {
          description: this.getFamilyDescription($),
          skills: this.getFamilySkills($)
        };
        let result = {
          family: family,
          title: $("h1").text().trim(),
          levels: $('.govspeak h2')
            .map( (index, level) => {
              return this.transformLevelData($, family_meta_data, level);  
            })
            .toArray()
            .slice(1,-1)
        };
        resolve( flattenData ? this.flattenData(result, family_meta_data) : result );
      });
    })
  }

  getSkillsForAllFamilies(url) {
    return new Promise(resolve => {
      cheerioReq(url, (err, $) => {

        var family_names = [];
        var family_data = [];
        var promise_results = [];
        
        $(".group-title").each(function() {
          const family_name = $( this ).text().replace(" job family", "");
          family_names.push(family_name);
        });
  
        $(".gem-c-document-list").each(function(index) {
          $(this).find(".gem-c-document-list__item").each(function() {
            $(this).find("a").text();
            const link = $(this).find("a").attr('href');
            
            family_data.push({
              family: family_names[index],
              href: "http://www.gov.uk" + link
            })
          })
        });
  
        family_data.forEach(entry => promise_results.push(this.getSkillsForFamily(entry.family, entry.href, true))) // This is working

        resolve(promise_results);
      })
    })
  }

  // Creates a promise consisting of all the promises
  getSkillsForAllFamiliesFlattened(url) {
    return this.getSkillsForAllFamilies(url).then(promise_results => {
      return Promise.all(promise_results).then((values) => {
        var flattened_array = values.flat()
        return flattened_array
      });
    }) 
  }

  getFamilyDescription($) {
    let familyDescriptions = {};
    familyDescriptions.pretext = $('.govspeak h2').first().nextAll('p').first().text();
    familyDescriptions.responsibilities = $('.govspeak h2').first().nextAll('p').first().next().find('li').map((i, text) => $(text).html()).toArray(); // Working

    return familyDescriptions;
  }

  getFamilySkills($) {
    let skills = {};
    $('.govspeak h2').first().nextAll('h3').first().nextAll('ul').first().find('li')
      .each( (i, skill) => {
        let name = $(skill).find('strong').text().trim();
        let description = $(skill);
        description.find('strong').remove();
        skills[name] = description.text().substring(3).trim();
      });
    return skills;
  }

  transformLevelData($, family_meta_data, level) {
    let transformedData = {}
    let transformedDataSkillList = $(level).nextAll('h3').first().next('ul')

    transformedData.title = $(level).text().trim()
    transformedData.description = $(level).next('p').text()
    transformedData.duties = $(level).next('p').next('ul').find('li').map( (i, duty) => {
      return $(duty).text().trim();
    }).toArray()
    transformedData.skills = transformedDataSkillList.find('li').map( (i, duty) => {
      let name = $(duty).find('strong').text().trim();
      let skill_level_description = $(duty);
      let skill_level_regex_match = skill_level_description.text().match(/\(Relevant skill level: (.*?)\)/)
      let skill_level = skill_level_regex_match ? skill_level_regex_match[1] : '';

      skill_level_description.find('strong').remove();
      skill_level = skill_level.charAt(0).toUpperCase() + skill_level.slice(1);

      return {
        name: name,
        description: family_meta_data.skills[name],
        skill_level: skill_level,
        skill_level_description: skill_level_description.text().substring(3).replace(/\(Relevant skill level: (.*?)\)/, '').trim(),
      };
    }).toArray()

    if ($(level).nextAll('h3').first().next('ul').next("h3").length != 0) {
      var managementSkills = $(level).nextAll('h3').first().next('ul').next("h3").next("ul").find('li').map( (i, duty) => {
        let name = $(duty).find('strong').text().trim();
        let skill_level_description = $(duty);
        let skill_level = skill_level_description.text().substring(3).match(/\(Relevant skill level: (.*?)\)/)[1];
  
        skill_level_description.find('strong').remove();
        skill_level = skill_level.charAt(0).toUpperCase() + skill_level.slice(1);
  
        return {
          name: name,
          description: family_meta_data.skills[name],
          skill_level: skill_level,
          skill_level_description: skill_level_description.text().substring(3).replace(/\(Relevant skill level: (.*?)\)/, '').trim(),
        };
      }).toArray()
      transformedData.skills = transformedData.skills.concat(managementSkills)
    }

    return transformedData
  }

  flattenData(roles, family_meta_data) {
    var data = [];
    roles.levels.forEach( level => { 
      level.skills.forEach( skill => {
        data.push({
          job_family: roles.family,
          role: roles.title, 
          role_level: level.title, 
          role_description_intro: `${family_meta_data.description.pretext}\n${family_meta_data.description.responsibilities.map(r => `- ${r}`).join('\n')}`,
          skills_they_need: `${level.description}\n\n${level.duties.map(d => `- ${d}`).join('\n')}`,
          skill_name: skill.name, 
          skill_description: skill.description,
          skill_level: skill.skill_level,
          skill_level_description: skill.skill_level_description
        });
      });
    });

    if (data.length == 0) {
      data.push({
        job_family: roles.family,
          role: roles.title,
          role_level: '',
          role_description_intro: '',
          skills_they_need: '',
          skill_name: '',
          skill_description: '', 
          skill_level: '', 
          skill_level_description: ''
      })
    }
    return data;
  }
}

module.exports = new SkillsScraperService()