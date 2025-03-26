const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const userAdmin = async (req, res, next) => {    
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admin only." });
    }
    next();
};

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');
    
    if (!token) return res.status(403).json({ message: "Access denied. No token provided." });
    
    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        let user = await User.findOne({ email });

        if (user) return res.status(400).json({ message: "Utilisateur déjà existant" });
        const hashedPassword = await bcrypt.hash(password, 10);

        user = new User({ name, email, password: hashedPassword, role });
        await user.save();

        res.status(201).json({ message: "Utilisateur créé avec succès" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Email ou mot de passe incorrect" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Email ou mot de passe incorrect" });

        if (user.isBlocked) return res.status(403).json({ message: "Votre compte est bloqué" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.put('/block/:id', authenticateToken, userAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

        user.isBlocked = !user.isBlocked;
        await user.save();

        res.json({ message: `Utilisateur ${user.isBlocked ? 'bloqué' : 'débloqué'}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Usert Part
router.get('/users', authenticateToken , async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get("/user/:id" , authenticateToken, userAdmin, async (req, res) => {
    try {        
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/user/:id", authenticateToken, userAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

        const { name, email, role } = req.body;
        user.name = name;
        user.email = email;
        user.role = role;
        await user.save();

        res.json({ message: "Utilisateur modifié avec succès" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/user/:id", authenticateToken, userAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) 
            return res.status(404).json({ message: "Utilisateur non trouvé" });

        res.json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;