const homeController = require('../controllers/homeController');
const jwtVerify = require('../middleware/jwtVerify');

const router = require('express').Router();

router.get('/', jwtVerify.verifyToken, homeController.showHome);
router.get('/:slug', jwtVerify.verifyToken, homeController.showProductByCategory);

module.exports = router;