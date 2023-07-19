import EErrors from '../errors/EErrors.js';

export default (error, req, res, next) => {
	console.log(error.cause);

	switch( error.code ) {
		case EErrors.PRODUCT_ID_NOT_VALID:
			res.send({status: 'error', error: error.name});
			break;

    case EErrors.PRODUCT_NOT_VALID:
      res.send({status: 'error', error: error.name});
      break;
  

		default:
			res.send({status: "error", error: 'unhandled error'});
	}
  next();
}