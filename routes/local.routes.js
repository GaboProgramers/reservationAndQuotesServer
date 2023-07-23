const { Router } = require('express');
const { check } = require('express-validator');
const { upload } = require('../utils/multer');
const { validateFields } = require('../middlewares/validateField.middleware');
const { createLocal } = require('../controllers/local.controller');
const { validExistLocal } = require('../middlewares/local.middleware');
const { protect } = require('../middlewares/auth/auth.middleware');

const router = new Router();

router.use(protect);

router.post(
  '/create-local',
  [
    upload.array('localImgs', 4),
    check('localName', 'the local name es required').not().isEmpty(),
    check('address', 'the address es required').not().isEmpty(),
    check('phone', 'the phone es required').not().isEmpty(),
    check('inCharge', 'the inCharge es required').not().isEmpty(),
    validateFields,
    validExistLocal,
  ],
  createLocal
);

module.exports = {
  localRouter: router,
};
