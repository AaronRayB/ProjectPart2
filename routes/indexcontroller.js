module.exports = {
    displayHomePage: (req, res) => res.render('index', { title: 'Home', displayName: req.user ? req.user.displayName : '' }),
    displayAboutPage: (req, res) => res.render('about', { title: 'About', displayName: req.user ? req.user.displayName : '' }),
    displayProductPage: (req, res) => res.render('products', { title: 'Products', displayName: req.user ? req.user.displayName : '' }),
    displayServicePage: (req, res) => res.render('services', { title: 'Services', displayName: req.user ? req.user.displayName : '' }),
    displayContactPage: (req, res) => res.render('contact', { title: 'Contact', displayName: req.user ? req.user.displayName : '' }),
    displayLoginPage: (req, res) => res.render('login', { title: 'Login' }),
    processLoginPage: (req, res) => {
       
        res.redirect('/');
    },
    displayRegisterPage: (req, res) => res.render('register', { title: 'Register' }),
    processRegisterPage: (req, res) => {
        
        res.redirect('/login');
    },
    performLogout: (req, res) => {
        req.logout();
        res.redirect('/login');
    }
};
