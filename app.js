require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const helmet=require('helmet');
const cors=require('cors');
const xss=require('xss-clean');
const rateLimiter=require('express-rate-limit');
const authenticateUser=require('./middleware/authentication');
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
//swagger
const swaggerUI=require('swagger-ui-express')
const YAML=require('yamljs');
const swaggerDocument=YAML.load('./swagger.yaml')
//router
const authRouter=require('./routes/auth');
const jobsRouter=require('./routes/jobs');

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
//extra security packages
app.use(helmet());
app.use(cors());
app.use(xss());
const connectDB=require('./db/connect');
app.use(express.json());

// routes
app.get('/', (req, res) => {
  //console.log('sss')
  res.send('<h1>JOBS-API</h1><a href="/api-docs"> Documentation</a>');
});
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocument));
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/jobs',authenticateUser,jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {

  try {
    //console.log(process.env.MONGO_URI);
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>{
      console.log(`Server is listening on port ${port}...`)}
    );
    //console.log('inside');
  } catch (error) {
    console.log(error);
  }
};

start();
