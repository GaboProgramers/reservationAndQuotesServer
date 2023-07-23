const jwt = require('jsonwebtoken');
const User = require("../models/user.model");
const AppError = require("./appError");

const findUserByEmailOr404 = async (email) => {
    if (!email) {
        console.log('email no proporcionado findUserByEmailOr404');
    };

    const user = await User.findOne({
        where: {
            email,
            status: 'verified'
        }
    })

    if(!user) {
        console.log('usuario no existe findUserByEmailOr404');
    };

    return user
}

exports.recoberyTokenEmail = async (email) => {
    let user = await findUserByEmailOr404(email)

    console.log('estamos en recoberyTokenEmail', user);

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email
        },
        process.env.SECRETE_JWT_SEED,
        { expiresIn: process.env.JWT_EXPIRE_PASSWORD}
    )

    return {user, token}
}

exports.setTokenUser = async (id, token) => {
    let user = await User.findByPk(id)

    if(!user) {
        console.log('usuario no existe + setTokenUser ');
    };

    let updateUser = await user.update({token})

    return updateUser
}