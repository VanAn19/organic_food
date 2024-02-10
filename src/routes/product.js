const middlewareController = require('../controllers/middlewareController');
const productController = require('../controllers/productController');

const router = require('express').Router();

router.get('/:slug', middlewareController.verifyToken, productController.showProduct);
router.get('/search/:value', middlewareController.verifyToken, productController.searchProduct)

module.exports = router;