import React from 'react';
import PropTypes from 'prop-types';
import TermsAndConditionsModal from '../TermsAndConditionsModal';

export default function MovieBookingModals({ flow }) {
  if (!flow) return null;

  return (
    <TermsAndConditionsModal
      open={flow.termsOpen}
      onCancel={flow.handleTermsCancel}
      onAccept={flow.handleTermsAccept}
    />
  );
}

MovieBookingModals.propTypes = {
  flow: PropTypes.shape({
    termsOpen: PropTypes.bool,
    pendingMovie: PropTypes.object,
    handleTermsCancel: PropTypes.func,
    handleTermsAccept: PropTypes.func,
  }),
};
