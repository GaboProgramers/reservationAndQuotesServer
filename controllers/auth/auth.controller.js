const jwt = require('jsonwebtoken');
const User = require('../../models/user.model');
const catchAsync = require('../../utils/catchAsync');
const bcrypt = require('bcryptjs');
const AppError = require('../../utils/appError');
const { generateJWT } = require('../../utils/jwt');
const {
  getTemplate,
  sendMail,
  transporter,
} = require('../../utils/nodemailer');
/* const {
  recoberyTokenEmail,
  setTokenUser,
} = require('../../utils/recoberyPassword'); */

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

  const data = JSON.parse(atob(token.split('.')[1]));

  if (!data) {
    return next(new AppError('Error al obtener data', 404));
  }

  const { email, id } = data;

  // verificar que existe el usuario
  const user = await User.findOne({
    where: {
      id,
      email,
    },
  });

  if (!user) {
    return next(new AppError('Usuario no existe', 404));
  }

  // verificar el id
  if (id !== user.id) {
    return next(new AppError('El identificador no coincide.', 404));
  }

  // actualizar usuario

  user.status = 'verified';
  await user.save();

  // redireccionar a la confirmacion.!
  res.status(201).json({
    status: 'sucsess',
    msg: 'usuario confirmado con exito.!',
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //? 1. Verificar si existe el usuario y la contraseña son correctas
  const user = await User.findOne({
    where: {
      email: email.toLowerCase(),
      status: 'verified',
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

exports.forgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  console.log(email);

  // verificar el correo enviado en la base de datos y buscar al usuario.

  const user = await User.findOne({
    where: {
      email,
      status: 'verified',
    },
  });

  if (!user) {
    console.log('usuario no existe');
  }

  // generar el nuevo token para realizar el cambio de contraseña por medio del email

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.SECRETE_JWT_SEED,
    { expiresIn: process.env.JWT_EXPIRE_PASSWORD }
  );

  await transporter.sendMail({
    from: `"ReservationAndCode ⭐" <${process.env.NODEMAILER_USER}>`,
    to: user.email,
    subject: 'Restore Password',
    html: `
    <head>
      <link rel="stylesheet" href="style.css" />
    </head>
  
    <div id="email__content">
      <h1 class="title">Reset Password</h1>
      <h2 class="sub">Hola ${user.firstName}</h2>
      <p class="paragr">
        Para restaurar tu cuenta sigue el enlace.
      </p>
    
      <a href="${process.env.PASSWORD_RESET_DOMAIN}/api/v1/auth/reset-password/${token}" target="_blank"
        >Restaurar contraseña</a
      >
    </div>
    `,
  });

  res.status(200).json({
    status: 'sucsess',
    msg: 'Email sended!, check your inbox',
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword} = req.body
  const {token} = req.params

  // convertimos el token en un objeto leible.
  const data = JSON.parse(atob(token.split('.')[1]));

  // buscar usuario en la base de datos
  const user = await User.findOne({
    where: {
      id: data.id,
      email: data.email,
      status: 'verified'
    }
  })

  // verificar contraseña
  const verifPassword = await bcrypt.compare(currentPassword, user.password)

  if (!verifPassword) {
    return next(new AppError('Incorrect password', 401));
  }

  if (currentPassword === newPassword) {
    return next(new AppError('La contraseña es igual a tu contraseña actual', 401));
  }

  // encriptamos la nueva contraseña
  const salt = await bcrypt.genSalt(10);
  const encriptedPassword = await bcrypt.hash(newPassword, salt);

  // actualizamos la contraseña del usuario en la base de datos.!
  await user.update({
    password: encriptedPassword,
    passwordChangeAt: new Date(),
  });

  await transporter.sendMail({
    from: `"ReservationAndCode ⭐" <${process.env.NODEMAILER_USER}>`,
    to: user.email,
    subject: 'Contraseña Actualizada con exito',
    html: `
    <head>
      <link rel="stylesheet" href="style.css" />
    </head>
  
    <div id="email__content">
      <h1 class="title">Update Password Succssesfully</h1>
      <h2 class="sub">Hola ${user.firstName}</h2>
      <p class="paragr">
        Tu contraseña a sido actualizada con exito Inicia sesion para continuar a tu cuenta..!!
      </p>
    
      <a href="${process.env.DOMAIN}/#/login" target="_blank"
        >Iniciar Sesion</a
      >
    </div>
    `,
  });

  // y le damos una respuesta.!
  res.status(200).json({
    status: 'sucsess',
    message: 'The user password wa updated successfully, verifica tu inbox',
  });

})

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
