const jwt = require('jsonwebtoken')

function authenticateToken(req, res, next){
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({message: "Le token est obligatoire pour l'authentification"});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = decoded;
        next();
      }
      catch (error) {
        return res.status(401).json({ message: "token invalid" });
    }
}

module.exports = {authenticateToken}