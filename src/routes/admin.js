const adminController = require('../controllers/adminController');
const jwtVerify = require('../middleware/jwtVerify');
const upload = require('../middleware/upload');

const router = require('express').Router();

router.post('/product/add', jwtVerify.verifyTokenAndAuth, upload.array('image'), adminController.addProduct);
router.put('/product/:id', jwtVerify.verifyTokenAndAuth, adminController.updateProduct);
router.delete('/product/:id', jwtVerify.verifyTokenAndAuth, adminController.deleteProduct);
router.get('/product/trash', jwtVerify.verifyTokenAndAuth, adminController.getProductTrash);
router.patch('/product/:id', jwtVerify.verifyTokenAndAuth, adminController.restoreProduct);

router.get('/category', jwtVerify.verifyTokenAndAuth, adminController.showCategory);
router.post('/category/add', jwtVerify.verifyTokenAndAuth, adminController.addCategory);
router.put('/category/:id', jwtVerify.verifyTokenAndAuth, adminController.updateCategory);
router.delete('/category/:id', jwtVerify.verifyTokenAndAuth, adminController.deleteCategory);
router.get('/category/trash', jwtVerify.verifyTokenAndAuth, adminController.getCategoryTrash);
router.patch('/category/:id', jwtVerify.verifyTokenAndAuth, adminController.restoreCategory);

module.exports = router;