const middlewareController = require('../controllers/middlewareController');
const userController = require('../controllers/userController');

const router = require('express').Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/refresh', userController.requestRefreshToken);
router.post('/logout', middlewareController.verifyToken, userController.logOut);

module.exports = router;