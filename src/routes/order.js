const middlewareController = require('../controllers/middlewareController');
const orderController = require('../controllers/orderController');

const router = require('express').Router();

router.post('/pay', middlewareController.verifyToken, orderController.payCart);
router.get('/', middlewareController.verifyToken, orderController.showOrder);

module.exports = router;