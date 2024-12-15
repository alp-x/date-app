export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.errors.map(e => e.message)
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      error: 'Duplicate Entry',
      message: 'This record already exists'
    });
  }

  if (err.name === 'SequelizeDatabaseError') {
    return res.status(400).json({
      error: 'Database Error',
      message: 'An error occurred while processing your request'
    });
  }

  // Özel hata sınıfları için
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      error: err.name,
      message: err.message
    });
  }

  // Genel hata durumu
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
}; 