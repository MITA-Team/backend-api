const express = require('express');
const session = require('express-session');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');
const User = require('./models/user.model'); // Adjust the path as needed

const app = express();
const port = 5000;

app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/dbmita', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Express session setup
app.use(
  session({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Facebook authentication strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: '1517856768979872',
      clientSecret: '6a313d6f1fc403595c8d77f20dbb6438',
      callbackURL: 'http://localhost:5000/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'emails'],
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const user = await User.findOne({ accountId: profile.id });

        if (!user) {
          console.log('Adding new Facebook user to DB..');
          const newUser = new User({
            accountId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
          });
          await newUser.save();
          return done(null, newUser);
        } else {
          console.log('Facebook User already exists in DB..');
          return done(null, user);
        }
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize and Deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Routes
const facebookRouter = require('./controllers/facebook-auth');
app.use('/auth/facebook', facebookRouter);

app.get('/', (req, res) => {
  res.render('auth'); // Create an EJS template for your authentication view
});

app.listen(port, () => console.log('App listening on port ' + port));
