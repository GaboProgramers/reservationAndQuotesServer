const jwt = require('jsonwebtoken');

const generateJWT = (id, email, role) => {
  return new Promise((resolve, reject) => {
    
    const paylod = { id, email, role };

    jwt.sign(
      paylod,
      process.env.SECRETE_JWT_SEED,
      {
        expiresIn: process.env.JWT_EXPIRE_IN,
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject(err);
        }

        resolve(token);
      }
    );
  });
};

module.exports = {generateJWT};

// ! siempre sera de esta manera la configuracion del token
