const express = require("express");
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");


router.get('/signup', async(req, res)=> {
    res.render('users/signup.ejs')
})

router.post('/signup', wrapAsync(async(req, res)=> {
    try {
        let {username, password, email} = req.body;
    const newUser = new User({username, email});
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err)=> {
        if(err){
            return err;
        }
        res.redirect('/listings');
    })
    console.log(registeredUser);
    
    } catch (e) {
        console.log(e.message);
        res.redirect('/signup');
    }
})
);

router.get('/login', async(req, res)=> {
    res.render("users/login.ejs");
});

router.post('/login', saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    
}),  async(req, res)=> {
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
});

router.get('/logout', (req, res, next)=> {
    req.logOut((err)=> {
        if(err) {
            next(err);
        }
        res.redirect('/listings');
    })
})
module.exports = router;