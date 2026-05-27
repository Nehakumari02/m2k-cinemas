const M2K_LEGAL_NAME = 'M2K Entertainment Pvt. Ltd';

const M2K_REGISTERED_ADDRESS =
  'M2K Mall, 16, Mangalam Place District Centre, Sector 3, Rohini, New Delhi - 110085, India.';

const M2K_ROHINI_VENUE_LABEL = 'M2K Cinemas Rohini';

const M2K_ROHINI_ADDRESS =
  'M2K Mall, 16, Mangalam Place District Centre, Sector 3, Rohini, New Delhi - 110085, India.';

const M2K_PITAMPURA_VENUE_LABEL = 'M2K Cinemas Pitampura';

const M2K_PITAMPURA_ADDRESS =
  'M2K Mall, Plot No 4, Community Centre, Road No. 44, Pitampura, New Delhi, Delhi 110034';

function applyM2kVenueMeta(layout) {
  const name = String(layout.name || '');
  const isRohini = /rohini/i.test(name);
  const isPitampura = /pitampura/i.test(name);
  const isScreen = /\bscreen\b/i.test(name);

  const base = {
    ...layout,
    legalName: M2K_LEGAL_NAME,
    registeredAddress: M2K_REGISTERED_ADDRESS,
    showOnCinemasPage: !isScreen,
  };

  if (isRohini) {
    return {
      ...base,
      venueLabel: M2K_ROHINI_VENUE_LABEL,
      address: M2K_ROHINI_ADDRESS,
    };
  }

  if (isPitampura) {
    return {
      ...base,
      venueLabel: M2K_PITAMPURA_VENUE_LABEL,
      address: M2K_PITAMPURA_ADDRESS,
    };
  }

  return base;
}

module.exports = {
  M2K_LEGAL_NAME,
  M2K_REGISTERED_ADDRESS,
  M2K_ROHINI_VENUE_LABEL,
  M2K_ROHINI_ADDRESS,
  M2K_PITAMPURA_VENUE_LABEL,
  M2K_PITAMPURA_ADDRESS,
  applyM2kVenueMeta,
};
