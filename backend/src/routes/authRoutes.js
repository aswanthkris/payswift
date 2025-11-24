const express = require('express');
const router = express.Router();
const { signup, login, updateKYC } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.post('/kyc', protect, updateKYC);

module.exports = router;
