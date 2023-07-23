const Establishment = require('./establishment.model');
const EstablishmentImgs = require('./establishmentImgs.model');
const Rating = require('./rating.model');
const Reservation = require('./reservation.model');
const Service = require('./service.model');
const User = require('./user.model');

const initModel = () => {
  User.hasOne(Establishment);
  Establishment.belongsTo(User);

  User.hasMany(Reservation);
  Reservation.belongsTo(User);

  Service.hasMany(Reservation);
  Reservation.belongsTo(Service);

  User.hasMany(Rating);
  Rating.belongsTo(User);

  Establishment.hasMany(Rating);
  Rating.belongsTo(Establishment);

  Establishment.hasMany(EstablishmentImgs);
  EstablishmentImgs.belongsTo(Establishment);
};

module.exports = initModel;
