const express = require('express')
const router = express.Router()
const apiController = require('./controllers/ApiController')


// Add your routes here - above the module.exports line

router.get('/api', function (req, res) {
  apiController.getAllSkills().then( data => res.json(data));
})

router.get('/csv', function (req, res) {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'skills-download-' + Date.now() + '.csv\"');
  apiController.getAllSkillsCsv().then( data => res.send(data));
})


module.exports = router
