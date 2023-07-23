const { Router } = require('express');
const { check } = require('express-validator');
const {
  createUser,
  login,
  renewToken,
  confirmSign,
  forgetPassword,
  resetPassword,
} = require('../../controllers/auth/auth.controller');

const { protect } = require('../../middlewares/auth/auth.middleware');

const { validIfExistUserEmail } = require('../../middlewares/user.middleware');
const {
  validateFields,
} = require('../../middlewares/validateField.middleware');

const { upload } = require('../../utils/multer');

const router = Router();

router.get('/confirm/:token', confirmSign);

router.post(
  '/signup',
  [
    upload.single('profileImageUrl'),
    check('firstName', 'The firstName require').not().isEmpty(),
    check('lastName', 'The lastName require').not().isEmpty(),
    check('email', 'The email require').not().isEmpty(),
    check('email', 'The email must be a correct format').isEmail(),
    check('password', 'The pasword must be mandatory').not().isEmpty(),
    check('role', 'The role must be mandatory').not().isEmpty(),
    validateFields,
    validIfExistUserEmail,
  ],
  createUser
);

router.post(
  '/login',
  [
    check('email', 'The email require').not().isEmpty(),
    check('email', 'The email must be a correct format').isEmail(),
    check('password', 'The pasword must be mandatory').not().isEmpty(),
    validateFields,
  ],
  login
);

router.post(
  '/forgot-password',
  [
    check('email', 'The email require').not().isEmpty(),
    check('email', 'The email must be a correct format').isEmail(),
    validateFields,
  ],
  forgetPassword
);

router.patch(
  '/reset-password/:token',
  [
    check('currentPassword', 'The current password must be mandatory').not().isEmpty(),
    check('newPassword', 'The new password must be mandatory').not().isEmpty(),
    validateFields,
  ],
  resetPassword
);

router.use(protect);

router.get('/renew', renewToken);

module.exports = {
  authRouter: router,
};
