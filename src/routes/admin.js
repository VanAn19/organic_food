const adminController = require('../controllers/adminController');
const middlewareController = require('../controllers/middlewareController');
const upload = require('../middleware/upload');

const router = require('express').Router();

router.post('/add', middlewareController.verifyTokenAndAuth, upload.array('image'), adminController.addProduct);
router.put('/:id', middlewareController.verifyTokenAndAuth, adminController.updateProduct);
router.delete('/:id', middlewareController.verifyTokenAndAuth, adminController.deleteProduct);
router.get('/trash', middlewareController.verifyTokenAndAuth, adminController.getTrash);
router.patch('/:id', middlewareController.verifyTokenAndAuth, adminController.restoreProduct);

module.exports = router;