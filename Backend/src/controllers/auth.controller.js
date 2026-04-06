const userModel = require('../models/user.model');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const BlacklistToken = require('../models/blacklist.model');


/**
 * @name registerUserController
 * @desc Controller to handle user registration
 * @access Public 
 */

// async function registerUserController(req, res) {
//     try {
//         const { username, email, password } = req.body;

//         if (!username || !email || !password) {
//             return res.status(400).json({ message: 'All fields are required' });
//         }

//         const isUserAlreadyExists = await userModel.findOne({ $or: [{ username }, { email }] });
//         if (isUserAlreadyExists) {
//             return res.status(400).json({ message: 'Username or email already exists' });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const user = await userModel.create({ username, email, password: hashedPassword });

//         const token = jwt.sign({ id: user._id,username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });

//         res.cookie('token', token);

//         res.status(201).json({ 
//             message: 'User registered successfully',
//             user: {
//                 id: user._id,
//                 username: user.username,
//                 email: user.email
//             }
//         });

//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// }

/**
 * @name loginUserController
 * @desc Controller to handle user login
 * @access Public 
 */

// async function loginUserController(req, res) {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.status(400).json({ message: 'All fields are required' });
//     }

//     const user = await userModel.findOne({ email });

//     if (!user) {
//         return res.status(400).json({ message: 'Invalid email or password' });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);

//     if (!isPasswordValid) {
//         return res.status(400).json({ message: 'Invalid email or password' });
//     }

//     const token = jwt.sign({ id: user._id ,username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });

//     res.cookie('token', token);

//     res.status(200).json({
//         message: 'User logged in successfully',
//         user: {
//             id: user._id,
//             username: user.username,
//             email: user.email
//         }
//     });

    
// }


/**
 * @name logoutUserController
 * @desc Controller to handle user logout
 * @access Public 
 */

// async function logoutUserController(req, res) {
//     try {
//         const token = req.cookies.token;

//         if (!token) {
//             return res.status(400).json({ message: 'No token found' });
//         }

//         // Add token to blacklist
//         await BlacklistToken.create({ token });

//         // Clear token from cookie
//         res.clearCookie('token');

//         res.status(200).json({ message: 'User logged out successfully' });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// }


/**
 * @name getMeController
 * @desc Controller to get user details
 * @access Private 
 */

async function getMeController(req, res) {
    try {
        const user = await userModel.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(200).json({ 
            message: 'User details fetched successfully',
            user:{
            id: user._id,
            username: user.username,
            email: user.email
        } });
        
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = getMeController;