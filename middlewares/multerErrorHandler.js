const multerErrorHandler = (err, req, res, next) => {
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            status: false,
            message: 'File too large. Maximum size is 5MB.'
        });
    }
    
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
            status: false,
            message: 'Unexpected field name. Expected field name: "image"'
        });
    }
    
    if (err.message === 'Field name missing') {
        return res.status(400).json({
            status: false,
            message: 'Field name missing. Please send the file with field name "image"'
        });
    }
    
    if (err.message === 'Only image files are allowed!') {
        return res.status(400).json({
            status: false,
            message: 'Only image files are allowed!'
        });
    }
    
    // If it's a Multer error but not one we specifically handle
    if (err.code && err.code.startsWith('LIMIT_')) {
        return res.status(400).json({
            status: false,
            message: `Upload error: ${err.message}`
        });
    }
    
    // Pass other errors to the next error handler
    next(err);
};

export default multerErrorHandler;
