const express = require('express')
const router = express.Router()
const apiController = require('./controllers/ApiController')

// Add your routes here - above the module.exports line

router.get('/api', function (req, res, next) {
  apiController.getAllSkillsFamily()
  .then(data => res.json(data))
  .catch((error) => next(error));
})

router.get('/table', function (req, res, next) {
  apiController.getAllSkillsForAllFamiliesTableView(true)
  .then( data => res.render('table', {data: data}))
  .catch((error) => next(error));
})

router.get('/csv', function (req, res, next) {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'skills-download-' + Date.now() + '.csv\"');
  apiController.getAllSkillsFamilyCsv()
  .then( data => res.send(data))
  .catch((error) => next(error));
})

module.exports = router
