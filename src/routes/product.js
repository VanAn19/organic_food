const jwtVerify = require('../middleware/jwtVerify');
const productController = require('../controllers/productController');

const router = require('express').Router();

router.get('/get-image', productController.getImage);
router.get('/:slug', jwtVerify.verifyToken, productController.showProduct);
// router.get('/search/:value', jwtVerify.verifyToken, productController.searchProduct);

module.exports = router;