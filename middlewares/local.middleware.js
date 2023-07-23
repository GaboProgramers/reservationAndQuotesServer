const Local = require('../models/establishment.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.validExistLocal = catchAsync(async (req, res, next) => {
  const { localName } = req.body;

  const local = await Local.findOne({
    where: {
      localName: localName.toLowerCase(),
    },
  });

  if (local && local.status === 'disabled') {
    return next(
      new AppError(
        'The local exist, but it is deactivated, please talk to the administrator to activate it.',
        400
      )
    );
  }

  if (local) {
    return next(
      new AppError(
        'the name of the place already exists, please select another and/or contact the platform administrator.',
        400
      )
    );
  }

  next();
});

exports.validLocalId = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const local = await Local.findOne({
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
    where: {
      id,
      status: 'active',
    },
  });

  if (!local) {
    return next(new AppError('User not found', 400));
  }
  req.local = local;
  next();
});
