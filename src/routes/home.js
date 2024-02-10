const homeController = require('../controllers/homeController');
const middlewareController = require('../controllers/middlewareController');

const router = require('express').Router();

router.get('/', middlewareController.verifyToken, homeController.showHome);

module.exports = router;