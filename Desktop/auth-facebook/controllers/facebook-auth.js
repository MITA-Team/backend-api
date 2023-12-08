const express = require('express');
const passport = require('passport');

const router = express.Router();

// Route to initiate the Facebook authentication process
router.get('/', passport.authenticate('facebook', { scope: 'email' }));

// Callback route after the Facebook authentication process is complete
router.get(
  '/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/failed',
  }),
  function (req, res) {
    res.redirect('/profile');
  }
);

// Route that requires authentication
router.get('/profile', ensureAuthenticated, (req, res) => {
    console.log('reached /profile')
    res.send(`Hello, ${req.user.name}!`);
});

// Route to display a message when authentication fails
router.get('/failed', (req, res) => {
  req.logout();
  res.send('Authentication failed!');
});

// Route to sign out
router.get('/signout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Middleware to check if the user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/failed');
  }
}

module.exports = router;
