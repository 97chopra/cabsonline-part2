// Fare Calculator - CabsOnline
// Base fare + distance-based pricing using known NZ distances from Auckland

const DISTANCES_FROM_AUCKLAND = {
  // Auckland suburbs
  'auckland cbd': 5, 'auckland central': 5, 'city centre': 5,
  'newmarket': 8, 'parnell': 7, 'remuera': 10, 'epsom': 12,
  'mount eden': 10, 'mt eden': 10, 'ponsonby': 6, 'grey lynn': 8,
  'henderson': 25, 'west auckland': 25, 'manukau': 30,
  'botany': 35, 'howick': 35, 'pakuranga': 28,
  'north shore': 15, 'takapuna': 18, 'albany': 25,
  'pukekohe': 55, 'papakura': 45, 'drury': 50,
  'kumeu': 35, 'helensville': 55,

  // Outside Auckland
  'hamilton': 130, 'huntly': 100, 'ngaruawahia': 110,
  'tauranga': 210, 'mount maunganui': 215, 'mt maunganui': 215,
  'rotorua': 230, 'taupo': 280, 'whakatane': 300,
  'gisborne': 490, 'napier': 430, 'hastings': 435,
  'new plymouth': 360, 'palmerston north': 490, 'whanganui': 500,
  'wellington': 650, 'lower hutt': 655, 'upper hutt': 660,
  'nelson': 420, 'blenheim': 580, 'christchurch': 1060,
  'dunedin': 1450, 'invercargill': 1620, 'queenstown': 1480,
  'whangarei': 160, 'kerikeri': 240, 'paihia': 240,
}

const BASE_FARE = 5.00
const RATE_PER_KM = 2.50
const DEFAULT_DISTANCE = 20 // km if suburb unknown

export function calculateFare(pickupSuburb, destinationSuburb) {
  const pickup = (pickupSuburb || '').toLowerCase().trim()
  const destination = (destinationSuburb || '').toLowerCase().trim()

  // If no destination, short local trip
  if (!destination) {
    const distance = DISTANCES_FROM_AUCKLAND[pickup] || DEFAULT_DISTANCE
    const fare = BASE_FARE + (distance * RATE_PER_KM)
    return {
      distance: distance,
      fare: fare.toFixed(2),
      breakdown: `Base $${BASE_FARE} + ${distance}km × $${RATE_PER_KM}/km`
    }
  }

  // Calculate distance between pickup and destination
  const pickupDist = DISTANCES_FROM_AUCKLAND[pickup] || DEFAULT_DISTANCE
  const destDist = DISTANCES_FROM_AUCKLAND[destination] || DEFAULT_DISTANCE

  // Distance between the two points
  const distance = Math.abs(destDist - pickupDist) + Math.min(pickupDist, destDist)

  const fare = BASE_FARE + (distance * RATE_PER_KM)
  return {
    distance: distance,
    fare: fare.toFixed(2),
    breakdown: `Base $${BASE_FARE} + ${distance}km × $${RATE_PER_KM}/km`
  }
}