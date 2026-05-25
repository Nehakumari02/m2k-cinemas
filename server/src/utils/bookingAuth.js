const REGISTRATION_REQUIRED_MESSAGE =
  'Registration required. Please create a full account with your phone number to book tickets.';

function requiresRegistration(user, phone) {
  const normalizedPhone = String(phone || user?.phone || '').trim();
  if (user?.isSessionGuest) return true;
  if (!normalizedPhone) return true;
  return false;
}

function isRegistrationValidationError(err) {
  if (!err) return false;
  if (err.name === 'ValidationError' && err.errors?.phone) return true;
  const msg = String(err.message || '');
  return msg.includes('phone') && msg.includes('required');
}

function formatReservationError(err, user, phone) {
  if (requiresRegistration(user, phone) || isRegistrationValidationError(err)) {
    return REGISTRATION_REQUIRED_MESSAGE;
  }
  return err?.message || 'Reservation could not be created.';
}

module.exports = {
  REGISTRATION_REQUIRED_MESSAGE,
  requiresRegistration,
  isRegistrationValidationError,
  formatReservationError,
};
