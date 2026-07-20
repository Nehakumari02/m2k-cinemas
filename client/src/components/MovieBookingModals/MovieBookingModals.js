import React from 'react';
import PropTypes from 'prop-types';
import TermsAndConditionsModal from '../TermsAndConditionsModal';

import AdultWarningModal from '../AdultWarningModal';

export default function MovieBookingModals({ flow }) {
  if (!flow) return null;

  return (
    <>
      <AdultWarningModal
        open={flow.adultWarningOpen}
        onCancel={flow.handleAdultWarningCancel}
        onAccept={flow.handleAdultWarningAccept}
      />
      <TermsAndConditionsModal
        open={flow.termsOpen}
        onCancel={flow.handleTermsCancel}
        onAccept={flow.handleTermsAccept}
      />
    </>
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
