/** Primary venue cards (Rohini / Pitampura) — hide individual screens on browse pages. */
export function isPrimaryCinemaListing(cinema) {
  if (!cinema) return false;
  if (cinema.showOnCinemasPage === false) return false;
  if (cinema.showOnCinemasPage === true) return true;
  const name = String(cinema.name || '');
  return !/\bscreen\b/i.test(name);
}

export function filterPrimaryCinemas(cinemas = []) {
  return cinemas.filter(isPrimaryCinemaListing);
}

/** Group all cinemas (incl. screens) for admin showtime picker. */
export function groupCinemasByLocation(cinemas = []) {
  const pitampura = [];
  const rohini = [];
  const other = [];

  cinemas.forEach(cinema => {
    const name = String(cinema.name || '').toUpperCase();
    if (name.includes('PITAMPURA')) {
      pitampura.push(cinema);
    } else if (name.includes('ROHINI')) {
      rohini.push(cinema);
    } else {
      other.push(cinema);
    }
  });

  const sortByName = (a, b) =>
    String(a.name || '').localeCompare(String(b.name || ''));

  pitampura.sort(sortByName);
  rohini.sort(sortByName);
  other.sort(sortByName);

  return [
    { label: 'Pitampura', cinemas: pitampura },
    { label: 'Rohini', cinemas: rohini },
    { label: 'Other', cinemas: other },
  ].filter(group => group.cinemas.length > 0);
}
