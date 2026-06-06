const authService = require("../services/auth.service");

const register = async (req, res) => {
    try {
        const result = await authService.register(req.body);

        res.status(201).json(result);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const result = await authService.login(req.body);

        res.json(result);

    } catch (error) {
        res.status(401).json({
            message: error.message
        });
    }
};

const getMe = async (req, res) => {
    try {

        const user = await authService.getMe(
            req.user.id
        );

        res.json(user);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

module.exports = {
    register,
    login,
    getMe
};