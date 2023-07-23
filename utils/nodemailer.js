const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

transporter.verify().then(() => {
  console.log('funcion ejecutandose');
});

const sendMail = async (email, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"ReservationAndCode ⭐" <${process.env.NODEMAILER_USER}>`, // sender address
      to: email, // list of receivers
      subject, // Subject line
      text: 'Para confirmar el registro siga los siguientes pasos.', // plain text body
      html, // html body
    });
  } catch (error) {
    console.log('algo no va bien con el email', error);
  }
};

const getTemplate = (name, token) => {
  return `
      <head>
        <link rel="stylesheet" href="style.css" />
      </head>

    <div id="email__content">
      <h1 class="title">Confirmar Contraseña</h1>
      <h2 class="sub">Hola ${name}</h2>
      <p class="paragr">
        Para confirmar tu cuenta, ingresa en el siguiente enlace.
      </p>

      <a href="http://localhost:3000/api/v1/auth/confirm/${token}" target="_blank"
        >Confirmar Cuenta</a
      >
    </div>
  `
}

module.exports = { transporter, sendMail, getTemplate };
