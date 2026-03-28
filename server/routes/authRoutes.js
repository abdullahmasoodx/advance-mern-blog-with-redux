const express = require('express');
const router = express.Router();

const {regieterUser,loginUser} = require('../controllers/authController');
const {validate,registerValidation,loginValidation} = require('../middleware/validationMiddleware');


router.post('/register',registerValidation,validate,regieterUser);
router.post('/login',loginValidation,validate,loginUser);

module.exports = router;