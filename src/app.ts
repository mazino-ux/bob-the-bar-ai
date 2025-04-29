import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { config } from './config/env';
import { corsList } from './utils/constants';
import { rateLimit } from 'express-rate-limit';

   dotenv.config();

   const app = express();


    // Limit API requests in specified time
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        limit: 500, // Limit each IP to 500 requests per `window` (here, per 15 minutes)
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        message: 'Too many requests from this IP. Try again in 15 minutes',
    });
    
    app.use(limiter);
    
    // cors
    app.use(
        cors({
        origin: corsList,
        })
    );

   // Middleware
   app.use(cors());
   app.use(express.json());

   // Not found route
    app.use((req, res) => {
        res.status(404).json({ message: 'API route not found.' });
    });


   // Test route
   app.get('/', (req, res) => {
     res.send(`${config.APP_NAME} is running! 🍸`);
   });

   export default app;



// So please, rate this structure for this bob the bar ai i'm building, do you think it's okay, plus the code , please if the structure is not professional help me out, draft a structure that is professional, simple and easy, i love the idea of the v1 though just incase