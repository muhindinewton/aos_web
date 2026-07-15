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

function customLocations(): Record<string, ShopLocation> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORE_KEY) || '{}');
  } catch {
    return {};
  }
}

export function getShopLocation(shopName: string): ShopLocation | null {
  const custom = customLocations()[shopName];
  if (custom) return custom;
  return SEED_LOCATIONS.find(s => s.shopName === shopName) ?? null;
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
