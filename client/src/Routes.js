import React, { lazy, Suspense } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

import Loading from './components/Loading';
import { ProtectedRoute, WithLayoutRoute } from './routers';

import { AdminLayout, PublicLayout } from './layouts';

// Admin
const DashboardPage = lazy(() => import('./pages/Admin/Dashboard'));
const MovieList = lazy(() => import('./pages/Admin/MovieList'));
const CinemaList = lazy(() => import('./pages/Admin/CinemaList'));
const ShowtimeList = lazy(() => import('./pages/Admin/ShowtimeList'));
const ReservationList = lazy(() => import('./pages/Admin/ReservationList'));
const User = lazy(() => import('./pages/Admin/User'));
const Account = lazy(() => import('./pages/Admin/Account'));
const OfferList = lazy(() => import('./pages/Admin/OfferList'));
const ExperienceList = lazy(() => import('./pages/Admin/ExperienceList'));
const FoodList = lazy(() => import('./pages/Admin/FoodList/FoodList'));
const EventList = lazy(() => import('./pages/Admin/EventList/EventList'));
const ReviewList = lazy(() => import('./pages/Admin/ReviewList'));
const ProductList = lazy(() => import('./pages/Admin/ProductList'));
const OrderList = lazy(() => import('./pages/Admin/OrderList'));

// Register - Login
const Register = lazy(() => import('./pages/Public/Register'));
const Login = lazy(() => import('./pages/Public/Login'));

// Public
const HomePage = lazy(() => import('./pages/Public/HomePage'));
const MoviePage = lazy(() => import('./pages/Public/MoviePage'));
const MyDashboard = lazy(() => import('./pages/Public/MyDashboard'));
const AllMoviesPage = lazy(() => import('./pages/Public/AllMoviesPage/AllMoviesPage'));
const MovieCategoryPage = lazy(() =>
  import('./pages/Public/MovieCategoryPage')
);
const CinemasPage = lazy(() => import('./pages/Public/CinemasPage'));
const CinemaDetailPage = lazy(() => import('./pages/Public/CinemaDetailPage'));
const BookingPage = lazy(() => import('./pages/Public/BookingPage'));
const OffersPage = lazy(() => import('./pages/Public/OffersPage'));
const ExperiencePage = lazy(() => import('./pages/Public/ExperiencePage'));
const ShowtimingsPage = lazy(() => import('./pages/Public/ShowtimingsPage'));
const FoodComboPage = lazy(() => import('./pages/Public/FoodComboPage'));
const EventsPage = lazy(() => import('./pages/Public/EventsPage'));
const AboutUsPage = lazy(() => import('./pages/Public/AboutUsPage'));
const ContactUsPage = lazy(() => import('./pages/Public/ContactUsPage'));
const CareersPage = lazy(() => import('./pages/Public/CareersPage'));
const MediaPage = lazy(() => import('./pages/Public/MediaPage'));
const GalleryPage = lazy(() => import('./pages/Public/GalleryPage'));
const AdvertisePage = lazy(() => import('./pages/Public/AdvertisePage'));
const WalletPage = lazy(() => import('./pages/Public/WalletPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/Public/PrivacyPolicyPage'));
const TermsConditionsPage = lazy(() => import('./pages/Public/TermsConditionsPage'));
const ShopPage = lazy(() => import('./pages/Public/ShopPage'));
const CartPage = lazy(() => import('./pages/Public/CartPage'));
const MerchCheckoutPage = lazy(() => import('./pages/Public/MerchCheckoutPage'));

const Checkin = lazy(() => import('./pages/Public/Checkin'));

const Routes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Router>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />

          <WithLayoutRoute
            exact
            path="/checkin/:reservationId"
            component={Checkin}
            layout={PublicLayout}
          />

          <WithLayoutRoute
            exact
            path="/"
            layout={PublicLayout}
            component={HomePage}
          />
          <WithLayoutRoute
            exact
            path="/mydashboard"
            layout={PublicLayout}
            component={MyDashboard}
          />
          <WithLayoutRoute
            exact
            path="/movies"
            layout={PublicLayout}
            component={AllMoviesPage}
          />
          <WithLayoutRoute
            exact
            path="/cinemas"
            layout={PublicLayout}
            component={CinemasPage}
          />
          <WithLayoutRoute
            exact
            path="/cinemas/:id"
            layout={PublicLayout}
            component={CinemaDetailPage}
          />
          <WithLayoutRoute
            exact
            path="/offers"
            layout={PublicLayout}
            component={OffersPage}
          />
          <WithLayoutRoute
            exact
            path="/showtimings"
            layout={PublicLayout}
            component={ShowtimingsPage}
          />
          <WithLayoutRoute
            exact
            path="/food-combos"
            layout={PublicLayout}
            component={FoodComboPage}
          />
          <WithLayoutRoute
            exact
            path="/events"
            layout={PublicLayout}
            component={EventsPage}
          />
          <WithLayoutRoute
            exact
            path="/about-us"
            layout={PublicLayout}
            component={AboutUsPage}
          />
          <WithLayoutRoute
            exact
            path="/contact-us"
            layout={PublicLayout}
            component={ContactUsPage}
          />
          <WithLayoutRoute
            exact
            path="/careers"
            layout={PublicLayout}
            component={CareersPage}
          />
          <WithLayoutRoute
            exact
            path="/media"
            layout={PublicLayout}
            component={MediaPage}
          />
          <WithLayoutRoute
            exact
            path="/gallery"
            layout={PublicLayout}
            component={GalleryPage}
          />
          <WithLayoutRoute
            exact
            path="/advertise"
            layout={PublicLayout}
            component={AdvertisePage}
          />
          <WithLayoutRoute
            exact
            path="/privacy-policy"
            layout={PublicLayout}
            component={PrivacyPolicyPage}
          />
          <WithLayoutRoute
            exact
            path="/terms-conditions"
            layout={PublicLayout}
            component={TermsConditionsPage}
          />
          <WithLayoutRoute
            exact
            path="/mywallet"
            layout={PublicLayout}
            component={WalletPage}
          />
          <WithLayoutRoute
            exact
            path="/experience/:id"
            layout={PublicLayout}
            component={ExperiencePage}
          />
          <WithLayoutRoute
            exact
            path="/shop"
            layout={PublicLayout}
            component={ShopPage}
          />
          <WithLayoutRoute
            exact
            path="/cart"
            layout={PublicLayout}
            component={CartPage}
          />
          <WithLayoutRoute
            exact
            path="/merch-checkout"
            layout={PublicLayout}
            component={MerchCheckoutPage}
          />
          <WithLayoutRoute
            exact
            path="/movie/category/:category"
            layout={PublicLayout}
            component={MovieCategoryPage}
          />
          <WithLayoutRoute
            exact
            path="/movie/:id"
            layout={PublicLayout}
            layoutProps={{ withFooter: false }}
            component={MoviePage}
          />
          <WithLayoutRoute
            exact
            path="/movie/booking/:id"
            layout={PublicLayout}
            layoutProps={{ withFooter: false }}
            component={BookingPage}
          />
          <WithLayoutRoute
            exact
            path="/movie/booking/:id/seats"
            layout={PublicLayout}
            layoutProps={{ withFooter: false }}
            component={BookingPage}
          />
          <ProtectedRoute
            exact
            path="/admin/dashboard"
            layout={AdminLayout}
            component={DashboardPage}
          />
          <ProtectedRoute
            exact
            path="/admin/users"
            layout={AdminLayout}
            component={User}
          />
          <ProtectedRoute
            exact
            path="/admin/showtimes"
            layout={AdminLayout}
            component={ShowtimeList}
          />
          <ProtectedRoute
            exact
            path="/admin/reservations"
            layout={AdminLayout}
            component={ReservationList}
          />
          <ProtectedRoute
            exact
            path="/admin/cinemas"
            layout={AdminLayout}
            component={CinemaList}
          />
          <ProtectedRoute
            exact
            path="/admin/movies"
            layout={AdminLayout}
            component={MovieList}
          />
          <ProtectedRoute
            exact
            path="/admin/account"
            layout={AdminLayout}
            component={Account}
          />
          <ProtectedRoute
            exact
            path="/admin/offers"
            layout={AdminLayout}
            component={OfferList}
          />
          <ProtectedRoute
            exact
            path="/admin/products"
            layout={AdminLayout}
            component={ProductList}
          />
          <ProtectedRoute
            exact
            path="/admin/orders"
            layout={AdminLayout}
            component={OrderList}
          />
          <ProtectedRoute
            exact
            path="/admin/experiences"
            layout={AdminLayout}
            component={ExperienceList}
          />
          <ProtectedRoute
            exact
            path="/admin/food"
            layout={AdminLayout}
            component={FoodList}
          />
          <ProtectedRoute
            exact
            path="/admin/events"
            layout={AdminLayout}
            component={EventList}
          />
          <ProtectedRoute
            exact
            path="/admin/reviews"
            layout={AdminLayout}
            component={ReviewList}
          />
          <Route path="*" component={() => '404 NOT FOUND'} />
        </Switch>
      </Router>
    </Suspense>
  );
};

export default Routes;
