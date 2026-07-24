// Web port of mobile's shop_location_service.dart — shop location pins set by
// sellers and shown to buyers on product pages and the full map screen.

export interface ShopLocation {
  shopName: string;
  lat: number;
  lng: number;
  address: string;
}

// Seed demo shops so buyers see pins on the sample products.
const SEED_LOCATIONS: ShopLocation[] = [
  { shopName: 'TechHub Kenya', lat: -1.2675, lng: 36.8108, address: 'Westlands, Nairobi, Kenya' },
  { shopName: 'TechHub', lat: -1.2675, lng: 36.8108, address: 'Westlands, Nairobi, Kenya' },
  { shopName: 'Electronics Plus', lat: -1.2833, lng: 36.8172, address: 'Moi Avenue, Nairobi CBD, Kenya' },
  { shopName: 'John Kamau', lat: -1.3009, lng: 36.7869, address: 'Kilimani, Nairobi, Kenya' },
  { shopName: 'AutoMart Kenya', lat: -1.3032, lng: 36.8340, address: 'Ngong Road, Nairobi, Kenya' },
  { shopName: 'Furniture Palace', lat: -1.2721, lng: 36.8264, address: 'Parklands, Nairobi, Kenya' },
  { shopName: 'Apple Store KE', lat: -1.2921, lng: 36.8219, address: 'Kimathi Street, Nairobi CBD, Kenya' },
];

const STORE_KEY = 'aos-shop-locations';

// Approximate pins for every place used across the sample data. This is the
// fallback that lets services — whose sellers (Mary Wanjiku, Shine Auto, …) were
// never seeded as shops — still show a map, centred on the product's stated
// location. Neighbourhoods are listed so "Westlands, Nairobi" resolves to
// Westlands rather than the city centre.
const PLACE_PINS: Record<string, { lat: number; lng: number; label: string }> = {
  westlands: { lat: -1.2675, lng: 36.8108, label: 'Westlands, Nairobi' },
  karen:     { lat: -1.3197, lng: 36.7076, label: 'Karen, Nairobi' },
  kilimani:  { lat: -1.3009, lng: 36.7869, label: 'Kilimani, Nairobi' },
  parklands: { lat: -1.2621, lng: 36.8172, label: 'Parklands, Nairobi' },
  cbd:       { lat: -1.2833, lng: 36.8172, label: 'Nairobi CBD' },
  nairobi:   { lat: -1.2921, lng: 36.8219, label: 'Nairobi, Kenya' },
  mombasa:   { lat: -4.0435, lng: 39.6682, label: 'Mombasa, Kenya' },
  kisumu:    { lat: -0.0917, lng: 34.7680, label: 'Kisumu, Kenya' },
  nakuru:    { lat: -0.3031, lng: 36.0800, label: 'Nakuru, Kenya' },
  thika:     { lat: -1.0333, lng: 37.0693, label: 'Thika, Kenya' },
  kiambu:    { lat: -1.1714, lng: 36.8356, label: 'Kiambu, Kenya' },
  eldoret:   { lat:  0.5143, lng: 35.2698, label: 'Eldoret, Kenya' },
};

// Resolve a free-text location like "Westlands, Nairobi" to a pin, matching the
// most specific token first (neighbourhood before its city).
function locationToPin(location: string): { lat: number; lng: number; label: string } | null {
  for (const token of location.split(',').map(t => t.trim().toLowerCase())) {
    if (PLACE_PINS[token]) return PLACE_PINS[token];
  }
  return null;
}

function customLocations(): Record<string, ShopLocation> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORE_KEY) || '{}');
  } catch {
    return {};
  }
}

// Resolve a shop-or-place name to a pin. A seeded/custom shop wins; otherwise, if
// the name reads as a known place, a pin is synthesised from it. This keeps the
// product page and the /map/[shop] screen consistent — both link and resolve by
// the same string.
export function getShopLocation(shopName: string): ShopLocation | null {
  const custom = customLocations()[shopName];
  if (custom) return custom;
  const seeded = SEED_LOCATIONS.find(s => s.shopName === shopName);
  if (seeded) return seeded;
  const pin = locationToPin(shopName);
  if (pin) return { shopName, lat: pin.lat, lng: pin.lng, address: pin.label };
  return null;
}

// The pin to show on a product page: the seller's own shop if they set one,
// otherwise a pin derived from the product's location. Guarantees every product
// — physical goods and services alike — gets a map.
export function getProductShopLocation(product: { location: string; seller?: { name: string } | null }): ShopLocation | null {
  const bySeller = product.seller ? getShopLocation(product.seller.name) : null;
  if (bySeller) return bySeller;
  const pin = locationToPin(product.location);
  if (!pin) return null;
  return { shopName: product.location, lat: pin.lat, lng: pin.lng, address: pin.label };
}

export function setShopLocation(location: ShopLocation) {
  try {
    const all = customLocations();
    all[location.shopName] = location;
    window.localStorage.setItem(STORE_KEY, JSON.stringify(all));
  } catch { /* storage unavailable */ }
}

export function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// OpenStreetMap iframe embed URL centred on the pin (keyless, works anywhere).
export function osmEmbedUrl(lat: number, lng: number, zoomDelta = 0.01): string {
  const bbox = [lng - zoomDelta, lat - zoomDelta, lng + zoomDelta, lat + zoomDelta].join('%2C');
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
}

export function directionsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}
