const express = require('express');
const path = require('path');
const fs = require('fs');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.join(__dirname, '../.env') });
}

const mongoose = require('mongoose');
require('./db/mongoose');

// Routes
const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');
const cinemaRouter = require('./routes/cinema');
const showtimeRouter = require('./routes/showtime');
const reservationRouter = require('./routes/reservation');
const invitationsRouter = require('./routes/invitations');
const paymentsRouter = require('./routes/payments');
const offersRouter = require('./routes/offers');
const experiencesRouter = require('./routes/experiences');
const foodRouter = require('./routes/food');
const eventRouter = require('./routes/event');
const walletRouter = require('./routes/wallet');
const productRouter = require('./routes/products');
const orderRouter = require('./routes/orders');
const foodOrderRouter = require('./routes/foodOrders');
const settingsRouter = require('./routes/settings');
const refundRouter = require('./routes/refunds');
const schoolGroupInquiryRouter = require('./routes/schoolGroupInquiries');
const membershipRouter = require('./routes/membership');
const guestLoginHandler = require('./handlers/guestLoginHandler');

const app = express();
app.disable('x-powered-by');
const port = process.env.PORT || 8080;

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, Accept, X-Requested-With, Content-Type, Authorization'
  );
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});
app.use(express.json());
app.post('/users/login/guest', guestLoginHandler);
app.use(userRouter);
app.use(movieRouter);
app.use(cinemaRouter);
app.use(showtimeRouter);
app.use(reservationRouter);
app.use(invitationsRouter);
app.use(paymentsRouter);
app.use(offersRouter);
app.use(experiencesRouter);
app.use(foodRouter);
app.use(eventRouter);
app.use(walletRouter);
app.use(productRouter);
app.use(orderRouter);
app.use(foodOrderRouter);
app.use(settingsRouter);
app.use(refundRouter);
app.use(schoolGroupInquiryRouter);
app.use(membershipRouter);

app.get('/health', (req, res) => {
  res.send({
    ok: true,
    port,
    mongo: mongoose.connection.readyState === 1,
    routes: [
      'POST /users/login/guest',
      'POST /school-group-inquiries',
      'GET /admin/school-group-inquiries',
    ],
  });
});

// JSON 404 for unmatched POST/PUT/PATCH/DELETE (avoids HTML "Cannot POST ..." in the client)
app.use((req, res, next) => {
  if (['GET', 'HEAD'].includes(req.method)) {
    return next();
  }
  res.status(404).json({
    error: {
      message: `No API route for ${req.method} ${req.originalUrl}. Restart the server: cd server && npm run dev`,
    },
  });
});

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const clientBuildDir = path.join(__dirname, '../../client/build');
const clientIndexHtml = path.join(clientBuildDir, 'index.html');
const hasClientBuild = fs.existsSync(clientIndexHtml);

if (hasClientBuild) {
  app.use(express.static(clientBuildDir));
  app.get('/*', (req, res) => {
    res.sendFile(clientIndexHtml);
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      message: 'M2K Cinemas API',
      port,
      health: '/health',
      ui:
        'No production build found. For development run the React app: cd client && npm start (port 3000)',
    });
  });
  app.get('/*', (req, res) => {
    res.status(404).json({
      error: {
        message: `No route for GET ${req.originalUrl}. API is running; use the React dev server on port 3000 for the website.`,
      },
    });
  });
}

app.listen(port, () => {
  console.log(`app is running in PORT: ${port}`);
  console.log('Guest login: POST /users/login/guest');
  console.log('School bookings: POST /school-group-inquiries');
  if (!hasClientBuild) {
    console.log(
      'No client/build — API-only mode. Start UI: cd client && npm start → http://localhost:3000'
    );
  }
});
