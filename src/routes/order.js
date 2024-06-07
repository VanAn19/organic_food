const jwtVerify = require('../middleware/jwtVerify');
const orderController = require('../controllers/orderController');

const router = require('express').Router();

router.post('/pay', jwtVerify.verifyToken, orderController.payCart);
router.get('/', jwtVerify.verifyToken, orderController.showOrder);

module.exports = router;