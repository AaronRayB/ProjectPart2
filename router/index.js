let express = require('express');
const passport = require('passport');
let router = express.Router();
let jwt = require('jsonwebtoken');
let DB = require('../config/db');

let userModel = require('../models/user');
let User = userModel.User;

module.exports.displayHomePage = (req, res, next)=>{
    res.render('index', { 
        title: 'Home',
        displayName: req.user ? req.user.displayName:''    
    });
}

module.exports.displayAboutPage = (req, res, next) => {
    res.render('index', {  
        title: 'About',
        displayName: req.user ? req.user.displayName:''
});
}

module.exports.displayProductPage = (req, res, next) => {
    res.render('index', {  
        title: 'Products',
        displayName: req.user ? req.user.displayName:''
    });
}

module.exports.displayServicePage = (req, res, next) => {
    res.render('index', {  
        title: 'Services',
        displayName: req.user ? req.user.displayName:''
    });
}

module.exports.displayContactPage = (req, res, next) => {
    res.render('index', {  
        title: 'Contact',
        displayName: req.user ? req.user.displayName:''
    });
}

module.exports.displayLoginPage = (req, res,next) => {
    if (!req.user)
    {
        res.render('auth/login',
        {
            title: 'Login',
            message: req.flash('loginMessage'),
            displayName: req.user ? req.user.displayName: ''
        })
    }
    else
    {
        return res.redirect('/')
    }
}
module.exports.processLoginPage = (req, res, next) => {
    passport.authenticate('local',(err,user, info)=>
    {
        // server error
        if(err)
        {
            return next(err);
        }
        // is a login error
        if(!user)
        {
            req.flash('loginMessage',
            'AuthenticationError');
            return res.redirect('/login');
        }
        req.login(user,(err) => {
            if(err)
            {
                return next(err)
            }
            const payload = 
            {
                id: user._id,
                displayName: user.displayName,
                username: user.username,
                email: user.email
            }

            const authToken = jwt.sign(payload, DB.secret, {
                expiresIn: 604800 // 1 week
            });

            // TODO - Getting Ready to convert to API
            res.json({success: true, msg: 'User Logged in Successfully!', user: {
                id: user._id,
                displayName: user.displayName,
                username: user.username,
                email: user.email
            }, token: authToken});
            
        
        });
    })(req,res,next)
}

module.exports.displayRegisterPage = (req,res,next)=>{
    // check if the user is not already logged in 
    if(!req.user)
    {
        res.render('auth/register',
            {
                title: 'Register',
                message: req.flash('registerMessage'),
                displayName: req.user ? req.user.displayName: ''
            })
    }
    else
    {
        return res.redirect('/')
    }
}
module.exports.processRegisterPage = (req,res,next) => {
    let newUser = new User({
        username: req.body.username,
        //password: req.body.password,
        email:req.body.email,
        displayName: req.body.displayName
    })
    User.register(newUser, req.body.password, (err) =>{
        if(err)
        {
            console.log("Error: Inserting the new user");
            if(err.name=="UserExistsError")
                {
                    req.flash('registerMessage',
                    'Registration Error: User Already Exists');
                }
            return res.render('auth/register',
            {
                title:'Register',
                message: req.flash('registerMessage'),
                displayName: req.user ? req.user.displayName:''
            });
        }
        else
        {
        //    res.json({success:true, msg:'User registered Successfully'});
            // if registration is successful
            return passport.authenticate('local')(req,res,()=>{
                res.redirect('/book-list');
            })    
        }
    })
}

module.exports.performLogout = (req,res,next)=>
{
        
    req.logout(function(err){
        if(err){
            return next(err);
        }
    })
    res.redirect('/');
}
