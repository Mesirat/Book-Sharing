// import express from 'express';
// import connectDB from './config/db.js';
// import dotenv from 'dotenv';
// import { notFound,errorHandler } from './middleware/errorMiddleware.js';
// import cookieParser from 'cookie-parser';
// import userRoutes from './routes/userRoutes.js'
// import cors from 'cors'
// import passport from 'passport';
// import { Strategy } from 'passport-google-oauth20';
// dotenv.config();
// const app = express();
// const port = process.env.PORT|| 3000
// app.use(express.json());

// app.use(cookieParser())
// app.use('/users',userRoutes)
// app.use(passport.initialize())
// app.use(passport.session())
// app.use(cors())

// connectDB();
// app.use(notFound)
// app.use(errorHandler)
// passport.use(new Strategy({
//     clientID:process.env.CLIENT_ID,
//     clientSecret:process.env.CLIENT_SECRET,
//     callbackURL:'http://localhost:5173',
// },
// (accessToken,refreshToken,profile,done)=>{
//     return done(null,profile)
// })),
// passport.serializeUser((user,done)=>done(null,user));
// passport.deserializeUser((user,done)=>done(null,user))

// app.listen (port,()=>{
//     console.log(`App is running to port:${port}`)
// })

import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from './models/userModel.js';
dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(session({
    secret: process.env.SESSION_SECRET || 'defaultsecret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/auth/google/callback',
},    async (accessToken, refreshToken, profile, done) => {
    try {

      const email = profile.emails[0].value;
      const name = profile.displayName;
      const picture = profile.photos[0].value;

     
      let user = await User.findOne({ email });

      if (!user) {

        user = await User.create({
          name,
          email,
          picture,
          googleId: profile.id, 
        });
      }

    
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
)
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/login');
    });

app.use('/users', userRoutes);
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`App is running on port: ${port}`);
});
