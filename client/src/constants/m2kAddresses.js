export const M2K_LEGAL_NAME = 'M2K Entertainment Pvt. Ltd';

export const M2K_REGISTERED_ADDRESS =
  'M2K Mall, 16, Mangalam Place District Centre, Sector 3, Rohini, New Delhi - 110085, India.';

export const M2K_ROHINI_VENUE = {
  label: 'M2K Cinemas Rohini',
  address:
    'M2K Mall, 16, Mangalam Place District Centre, Sector 3, Rohini, New Delhi - 110085, India.',
  phone: '9818199906',
};

export const M2K_PITAMPURA_VENUE = {
  label: 'M2K Cinemas Pitampura',
  address:
    'M2K Mall, Plot No 4, Community Centre, Road No. 44, Pitampura, New Delhi, Delhi 110034',
  phone: '9818199923',
};

export function formatCinemaAddress(cinema) {
  if (!cinema) return '';
  if (cinema.address) return cinema.address;
  const name = String(cinema.name || '');
  if (/rohini/i.test(name)) return M2K_ROHINI_VENUE.address;
  if (/pitampura/i.test(name)) return M2K_PITAMPURA_VENUE.address;
  return '';
}

export function formatCinemaPhone(cinema) {
  if (!cinema) return '';
  const name = String(cinema.name || '');
  if (/rohini/i.test(name)) return M2K_ROHINI_VENUE.phone;
  if (/pitampura/i.test(name)) return M2K_PITAMPURA_VENUE.phone;
  return '';
}
