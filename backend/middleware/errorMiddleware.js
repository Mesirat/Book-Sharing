const notFound = (req,res,next)=>{
    const error = new Error(`Not Found - ${req.origionalUrl}`);
    res.status(404);
    next(error);
    
}

const errorHandler = (err,req,res,next)=>{
    let statusCode = res.statusCode ===200?500:res.statusCode;
    let message = err.message;
    if(err.name === 'CastError' && err.kind ==='Objectid'){
        statusCode = 404;
        message = 'Resourse Not Found'
    }
    res.status(statusCode).json({
        message,
        stack:ProcessingInstruction.env.NODE_ENV ==='production'? null : err.stack
    
    })
}
export {notFound,errorHandler}