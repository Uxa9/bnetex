module.exports = (req,res, next) => {
    
    req.requestParams = {...req.body, ...req.query}
    
    next();
}