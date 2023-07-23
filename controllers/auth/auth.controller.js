const User = require('../../models/user.model');
const catchAsync = require('../../utils/catchAsync');
const bcrypt = require('bcryptjs');
const AppError = require('../../utils/appError');
const { generateJWT } = require('../../utils/jwt');
const { getTemplate, sendMail } = require('../../utils/nodemailer');

exports.createUser = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;

  const user = new User({
    firstName: firstName.toLowerCase(),
    lastName: lastName.toLowerCase(),
    email: email.toLowerCase(),
    password,
    role,
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  await user.save();

  const token = await generateJWT(user.id, user.email);

  const template = getTemplate(firstName, token);

  await sendMail(email, 'este es un correo de prueba', template);

  res.status(201).json({
    status: 'success',
    message: 'The user was created successfully',
    token,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
  });
});

exports.confirmSign = catchAsync(async (req, res, next) => {
  // obtener el token

  const { token } = req.params;

  // verificar la data del token

  const data = JSON.parse(atob((token).split('.')[1]))

  if (!data) {
    return next(new AppError('Error al obtener data', 404));
  }

  const {email, id} = data

  // verificar que existe el usuario
  const user = await User.findOne({
    where: {
      id,
      email
    }
  })

  if (!user) {
    return next(new AppError('Usuario no existe', 404));
  }

  // verificar el id
  if (id !== user.id) {
    return next(new AppError('El identificador no coincide.', 404));
  }

  // actualizar usuario

  user.status = 'verified'
  await user.save()

  // redireccionar a la confirmacion.!
  res.status(201).json({
    status: 'sucsess',
    msg: 'usuario confirmado con exito.!'
  })
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //? 1. Verificar si existe el usuario y la contraseña son correctas
  const user = await User.findOne({
    where: {
      email: email.toLowerCase(),
      status: true,
    },
  });

  if (!user) {
    return next(new AppError('The user could not be found', 404));
  }

  const verifPassword = await bcrypt.compare(password, user.password);

  if (!verifPassword) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // ? 2. si todo esta bien, enviar token al cliente
  const token = await generateJWT(user.id);

  res.status(200).json({
    status: 'sucsess',
    message: 'successfully logged',
    token,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
  });
});

exports.renewToken = catchAsync(async (req, res, next) => {
  const { id } = req.sessionUser;

  const token = await generateJWT(id);

  const user = await User.findOne({
    attributes: ['id', 'firstName', 'email', 'role'],
    where: {
      status: true,
      id,
    },
  });

  return res.status(200).json({
    status: 'sucsess',
    token,
    user,
  });
});
