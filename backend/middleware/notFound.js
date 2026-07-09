const notFound = (req, res, next) => {
    res.status(404).json({
        status: "fail",
        message: `Cannot find ${req.originalUrl}`
    });
};

module.exports = notFound;