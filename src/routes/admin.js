const adminController = require('../controllers/adminController');
const middlewareController = require('../controllers/middlewareController');
const upload = require('../middleware/upload');

const router = require('express').Router();

router.post('/product/add', middlewareController.verifyTokenAndAuth, upload.array('image'), adminController.addProduct);
router.put('/product/:id', middlewareController.verifyTokenAndAuth, adminController.updateProduct);
router.delete('/product/:id', middlewareController.verifyTokenAndAuth, adminController.deleteProduct);
router.get('/product/trash', middlewareController.verifyTokenAndAuth, adminController.getProductTrash);
router.patch('/product/:id', middlewareController.verifyTokenAndAuth, adminController.restoreProduct);

router.get('/category', middlewareController.verifyTokenAndAuth, adminController.showCategory);
router.post('/category/add', middlewareController.verifyTokenAndAuth, adminController.addCategory);
router.put('/category/:id', middlewareController.verifyTokenAndAuth, adminController.updateCategory);
router.delete('/category/:id', middlewareController.verifyTokenAndAuth, adminController.deleteCategory);
router.get('/category/trash', middlewareController.verifyTokenAndAuth, adminController.getCategoryTrash);
router.patch('/category/:id', middlewareController.verifyTokenAndAuth, adminController.restoreCategory);

module.exports = router;