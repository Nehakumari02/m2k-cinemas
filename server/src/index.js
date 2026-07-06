const express = require('express');
const path = require('path');
const fs = require('fs');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

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
const foodBannersRouter = require('./routes/foodBanners');
const refundRouter = require('./routes/refunds');
const schoolGroupInquiryRouter = require('./routes/schoolGroupInquiries');
const corporateGroupInquiryRouter = require('./routes/corporateGroupInquiries');
const partyInquiryRouter = require('./routes/partyInquiries');
const membershipRouter = require('./routes/membership');
const newsletterRouter = require('./routes/newsletter');
const activityLogsRouter = require('./routes/activityLogs');
const notificationsRouter = require('./routes/notifications');
const feedbackRouter = require('./routes/feedback');
const chatbotRouter = require('./routes/chatbot');
const guestLoginHandler = require('./handlers/guestLoginHandler');
const adminAuditLog = require('./middlewares/adminAuditLog');

const app = express();
app.disable('x-powered-by');
const port = process.env.PORT || 8080;

app.use(function (req, res, next) {
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
app.use(express.urlencoded({ extended: true }));
app.use(adminAuditLog);
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
app.use(foodBannersRouter);
app.use(refundRouter);
app.use(schoolGroupInquiryRouter);
app.use(corporateGroupInquiryRouter);
app.use(partyInquiryRouter);
app.use(membershipRouter);
app.use(newsletterRouter);
app.use(activityLogsRouter);
app.use(notificationsRouter);
app.use(feedbackRouter);
app.use(chatbotRouter);

app.get('/health', (req, res) => {
  res.send({
    ok: true,
    port,
    mongo: mongoose.connection.readyState === 1,
    routes: [
      'POST /users/login/guest',
      'POST /school-group-inquiries',
      'GET /admin/school-group-inquiries',
      'POST /corporate-group-inquiries',
      'GET /admin/corporate-group-inquiries',
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
app.use('/admin-tools', express.static(path.join(__dirname, '../public')));


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
  console.log('Corporate bookings: POST /corporate-group-inquiries');
  if (!hasClientBuild) {
    console.log(
      'No client/build — API-only mode. Start UI: cd client && npm start → http://localhost:3000'
    );
  }
});



// has a feature called Git Version Control.

// You go to this tool in cPanel and connect it to your GitHub repository.
// Whenever you want to update your live site, you push your code to GitHub.
// Then, you click a single "Pull" button in cPanel. It instantly downloads all your changes from GitHub straight into your m2k-backend folder. (You still have to manually run npm run build for the frontend though, unless you set up deployment hooks).
// Method 2: GitHub Actions (Fully Automated & Professional) This is the ultimate setup. You create a special file in your project (like .github/workflows/deploy.yml). When you push code to GitHub, GitHub's servers automatically spin up a temporary computer and follow a script you wrote:

// It connects to your Hostinger server via FTP or SSH.
// It automatically uploads only the files that changed.
// It automatically runs npm install and npm run build for you.
// It restarts your Application Manager server.
