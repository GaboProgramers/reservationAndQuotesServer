const { Router } = require('express');
const { check } = require('express-validator');
const {
  updateUser,
  deleteUser,
  findUsers,
  findUser,
  updatePassword,
} = require('../controllers/user.controller');
const {
  protect,
  protectAccountOwner,
} = require('../middlewares/auth/auth.middleware');
const { validUserById } = require('../middlewares/user.middleware');
const { validateFields } = require('../middlewares/validateField.middleware');

const router = Router();

router.get('/', findUsers);

router.get('/:id', validUserById, findUser);

router.use(protect);

router.patch(
  '/:id',
  [
    check('username', 'The username require').not().isEmpty(),
    check('email', 'The email require').not().isEmpty(),
    check('email', 'The email must be a correct format').isEmail(),
    validateFields,
    validUserById,
    protectAccountOwner,
  ],
  updateUser
);

router.patch(
  '/password/:id',
  [
    check('currentPassword', 'The current password must be mandatory')
      .not()
      .isEmpty(),
    check('newPassword', 'The new password must be mandatory').not().isEmpty(),
    validateFields,
    validUserById,
    protectAccountOwner,
  ],
  updatePassword
);

router.delete('/:id', validUserById, protectAccountOwner, deleteUser);

module.exports = {
  usersRouter: router,
};
