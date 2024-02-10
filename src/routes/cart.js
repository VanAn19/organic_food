const cartController = require('../controllers/cartController');
const middlewareController = require('../controllers/middlewareController');

const router = require('express').Router();

router.post('/add-to-cart', middlewareController.verifyToken, cartController.addToCart);
router.delete('/:id', middlewareController.verifyToken, cartController.deleteCart);
router.get('/', middlewareController.verifyToken, cartController.showCart);

module.exports = router;