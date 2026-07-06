// Approximate coordinates for M2K Cinemas
export const CINEMA_COORDINATES = {
  rohini: { latitude: 28.736, longitude: 77.113 },
  pitampura: { latitude: 28.698, longitude: 77.139 }
};

// Returns the mapped coordinates for a given cinema based on its name or city
export const getCinemaCoordinates = (cinema) => {
  const searchStr = `${cinema.name || ''} ${cinema.city || ''} ${cinema.address || ''}`.toLowerCase();
  if (searchStr.includes('rohini')) {
    return CINEMA_COORDINATES.rohini;
  }
  if (searchStr.includes('pitampura')) {
    return CINEMA_COORDINATES.pitampura;
  }
  return null;
};

// Haversine formula to calculate distance in km between two coordinates
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};
