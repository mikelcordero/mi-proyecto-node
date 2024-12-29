// middlewares/errorMiddleware.js

function errorHandler(err, req, res, next) {
    console.error(`[ERROR]: ${err.message}`);
    res.status(err.status || 500).json({
        error: err.message || 'Ocurrió un error interno en el servidor',
    });
}

module.exports = errorHandler;
