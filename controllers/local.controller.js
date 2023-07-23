const { ref, uploadBytes } = require('firebase/storage');
const catchAsync = require('../utils/catchAsync');
const { storage } = require('../utils/firebase');
const Local = require('../models/establishment.model');
const LocalImgs = require('../models/establishmentImgs.model');

exports.createLocal = catchAsync(async (req, res, next) => {
  const { localName, address, phone, inCharge } = req.body;
  const { id } = req.sessionUser;

  const newLocal = await Local.create({
    localName: localName.toLowerCase(),
    address: address.toLowerCase(),
    phone,
    inChargeName: inCharge.toLowerCase(),
    userId: id,
  });

  const localImagesPromises = req.files.map(async file => {
    const imgRef = ref(storage, `localsImg/${Date.now()}-${file.originalname}`);

    const imgUpload = await uploadBytes(imgRef, file.buffer);

    return await LocalImgs.create({
      imgUrl: imgUpload.metadata.fullPath,
      localId: newLocal.id,
    });
  });

  await Promise.all(localImagesPromises);

  res.status(201).json({
    status: 'success',
    message: 'Local creado con exito',
    newLocal,
  });
});
