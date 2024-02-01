const tryCatch = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((error) => {
            console.error(error); 
            if(error.code === 11000){
                const field = Object.keys(error.keyValue)[0];
                    return res.status(400).json({
                    status: 'failed',
                    message: `${field.charAt(0).toUpperCase() + field.slice(1)} '${error.keyValue[field]}' already exists.`,
                }); 
            } else {
            return res.status(500).json({
                status: 'failed',
                message: 'Internal Server Error',
            })};
        });
    };
  };

module.exports = tryCatch;