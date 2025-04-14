export interface LocationCoordinates {
  lat: number;
  lon: number;
}

export interface LocationCity {
  city: string;
}

export type Location = LocationCoordinates | LocationCity;

export const isLocationCoordinates = (location: Location): location is LocationCoordinates => {
  return 'lat' in location && 'lon' in location;
};

export const isLocationCity = (location: Location): location is LocationCity => {
  return 'city' in location;
};

// Formats a location parameter for API requests
export const formatLocationParam = (location: Location): string => {
  return isLocationCoordinates(location) 
    ? `location=${location.lat},${location.lon}`
    : `location=${encodeURIComponent(location.city.replace(/,/g, ' ').trim())}`;
};

// Formats a location string for display purposes
export const formatLocationString = (locationData: any, location: Location): string => {
  let locationString = 'Unknown';
  if (!locationData) return locationString;

  if (locationData.name) {
    locationString = locationData.name;
    
    if (locationData.type === 'city' && locationData.country) {
      locationString += `, ${locationData.country}`;
    }
  } else if (isLocationCoordinates(location)) {
    locationString = `${location.lat}, ${location.lon}`;
  } else if (isLocationCity(location)) {
    locationString = location.city;
  }
  
  return locationString;
};

/**
 * Extracts location from an object with embedded location
 */
export const extractLocation = (data: { 
  location: { 
    city?: string; 
    coordinates?: { lat: number; lon: number } 
  } 
}): Location => {
  if (data.location.coordinates?.lat !== undefined && data.location.coordinates?.lon !== undefined) {
    return {
      lat: data.location.coordinates.lat,
      lon: data.location.coordinates.lon
    };
  } else if (data.location.city) return { city: data.location.city };
   
  throw new Error('Location must be specified with either coordinates or city');
}; 