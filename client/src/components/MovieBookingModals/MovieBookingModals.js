import React from 'react';
import PropTypes from 'prop-types';
import TermsAndConditionsModal from '../TermsAndConditionsModal';
import ContentWarningModal from '../ContentWarningModal/ContentWarningModal';

export default function MovieBookingModals({ flow }) {
  if (!flow) return null;

  return (
    <>
      <TermsAndConditionsModal
        open={flow.termsOpen}
        onCancel={flow.handleTermsCancel}
        onAccept={flow.handleTermsAccept}
      />
      <ContentWarningModal
        open={flow.warningOpen}
        handleClose={flow.handleWarningClose}
        handleContinue={flow.handleWarningContinue}
        movie={flow.pendingMovie}
      />
    </>
  );
}

MovieBookingModals.propTypes = {
  flow: PropTypes.shape({
    termsOpen: PropTypes.bool,
    warningOpen: PropTypes.bool,
    pendingMovie: PropTypes.object,
    handleTermsCancel: PropTypes.func,
    handleTermsAccept: PropTypes.func,
    handleWarningClose: PropTypes.func,
    handleWarningContinue: PropTypes.func,
  }),
};
