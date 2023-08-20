import multer from "multer";

import __dirname from "../utils.js";

const sources = {
  PROFILE: 'profileImage', // user profile image
  PRODUCT: 'productImage', // product image
  DOCUMENT: 'document', // user document
}

// Campo con un archivo. Los nombres de los campos deben ser 'profileImage', 'productImage' o 'document'
const multerMiddleware = ( sourceType ) => {
  let upload;

  switch( sourceType ) {
    case sources.PROFILE:
      upload = multer(getMulterConfig('images/profiles'));
      return upload.single(sources.PROFILE);

    case sources.PRODUCT:
      upload = multer(getMulterConfig('images/products'));
      return upload.array(sources.PRODUCT, 5);
      
    case sources.DOCUMENT:
      upload = multer(getMulterConfig('documents'));
      return upload.single(sources.DOCUMENT);
  }
}

const getMulterConfig = ( path ) => {
  return {
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, `${ __dirname }/public/${ path }`);
      },
      filename: (req, file, cb) => {
        const uniqueFileName = Date.now() + '-' + file.originalname;
        cb( null, uniqueFileName );
      }
    }),
  }
}

export {multerMiddleware, sources};