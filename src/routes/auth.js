const jwtVerify = require('../middleware/jwtVerify');
const authController = require('../controllers/authController');

const router = require('express').Router();

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/refresh', authController.requestRefreshToken);
router.post('/logout', jwtVerify.verifyToken, authController.logOut);

module.exports = router;