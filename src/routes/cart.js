const cartController = require('../controllers/cartController');
const jwtVerify = require('../middleware/jwtVerify');

const router = require('express').Router();

router.post('/add-to-cart', jwtVerify.verifyToken, cartController.addToCart);
router.delete('/:id', jwtVerify.verifyToken, cartController.deleteCart);
router.get('/', jwtVerify.verifyToken, cartController.showCart);

module.exports = router;