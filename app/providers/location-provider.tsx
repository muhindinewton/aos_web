'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Country {
  name: string;
  code: string;
}

export const COUNTRIES: Country[] = [
  { name: 'Afghanistan', code: 'AF' },
  { name: 'Albania', code: 'AL' },
  { name: 'Algeria', code: 'DZ' },
  { name: 'Andorra', code: 'AD' },
  { name: 'Angola', code: 'AO' },
  { name: 'Antigua and Barbuda', code: 'AG' },
  { name: 'Argentina', code: 'AR' },
  { name: 'Armenia', code: 'AM' },
  { name: 'Australia', code: 'AU' },
  { name: 'Austria', code: 'AT' },
  { name: 'Azerbaijan', code: 'AZ' },
  { name: 'Bahamas', code: 'BS' },
  { name: 'Bahrain', code: 'BH' },
  { name: 'Bangladesh', code: 'BD' },
  { name: 'Barbados', code: 'BB' },
  { name: 'Belarus', code: 'BY' },
  { name: 'Belgium', code: 'BE' },
  { name: 'Belize', code: 'BZ' },
  { name: 'Benin', code: 'BJ' },
  { name: 'Bhutan', code: 'BT' },
  { name: 'Bolivia', code: 'BO' },
  { name: 'Bosnia and Herzegovina', code: 'BA' },
  { name: 'Botswana', code: 'BW' },
  { name: 'Brazil', code: 'BR' },
  { name: 'Brunei', code: 'BN' },
  { name: 'Bulgaria', code: 'BG' },
  { name: 'Burkina Faso', code: 'BF' },
  { name: 'Burundi', code: 'BI' },
  { name: 'Cabo Verde', code: 'CV' },
  { name: 'Cambodia', code: 'KH' },
  { name: 'Cameroon', code: 'CM' },
  { name: 'Canada', code: 'CA' },
  { name: 'Central African Republic', code: 'CF' },
  { name: 'Chad', code: 'TD' },
  { name: 'Chile', code: 'CL' },
  { name: 'China', code: 'CN' },
  { name: 'Colombia', code: 'CO' },
  { name: 'Comoros', code: 'KM' },
  { name: 'Congo (Congo-Brazzaville)', code: 'CG' },
  { name: 'Costa Rica', code: 'CR' },
  { name: "Cote d'Ivoire", code: 'CI' },
  { name: 'Croatia', code: 'HR' },
  { name: 'Cuba', code: 'CU' },
  { name: 'Cyprus', code: 'CY' },
  { name: 'Czechia', code: 'CZ' },
  { name: 'DR Congo', code: 'CD' },
  { name: 'Denmark', code: 'DK' },
  { name: 'Djibouti', code: 'DJ' },
  { name: 'Dominica', code: 'DM' },
  { name: 'Dominican Republic', code: 'DO' },
  { name: 'Ecuador', code: 'EC' },
  { name: 'Egypt', code: 'EG' },
  { name: 'El Salvador', code: 'SV' },
  { name: 'Equatorial Guinea', code: 'GQ' },
  { name: 'Eritrea', code: 'ER' },
  { name: 'Estonia', code: 'EE' },
  { name: 'Eswatini', code: 'SZ' },
  { name: 'Ethiopia', code: 'ET' },
  { name: 'Fiji', code: 'FJ' },
  { name: 'Finland', code: 'FI' },
  { name: 'France', code: 'FR' },
  { name: 'Gabon', code: 'GA' },
  { name: 'Gambia', code: 'GM' },
  { name: 'Georgia', code: 'GE' },
  { name: 'Germany', code: 'DE' },
  { name: 'Ghana', code: 'GH' },
  { name: 'Greece', code: 'GR' },
  { name: 'Grenada', code: 'GD' },
  { name: 'Guatemala', code: 'GT' },
  { name: 'Guinea', code: 'GN' },
  { name: 'Guinea-Bissau', code: 'GW' },
  { name: 'Guyana', code: 'GY' },
  { name: 'Haiti', code: 'HT' },
  { name: 'Honduras', code: 'HN' },
  { name: 'Hungary', code: 'HU' },
  { name: 'Iceland', code: 'IS' },
  { name: 'India', code: 'IN' },
  { name: 'Indonesia', code: 'ID' },
  { name: 'Iran', code: 'IR' },
  { name: 'Iraq', code: 'IQ' },
  { name: 'Ireland', code: 'IE' },
  { name: 'Israel', code: 'IL' },
  { name: 'Italy', code: 'IT' },
  { name: 'Jamaica', code: 'JM' },
  { name: 'Japan', code: 'JP' },
  { name: 'Jordan', code: 'JO' },
  { name: 'Kazakhstan', code: 'KZ' },
  { name: 'Kenya', code: 'KE' },
  { name: 'Kiribati', code: 'KI' },
  { name: 'Kuwait', code: 'KW' },
  { name: 'Kyrgyzstan', code: 'KG' },
  { name: 'Laos', code: 'LA' },
  { name: 'Latvia', code: 'LV' },
  { name: 'Lebanon', code: 'LB' },
  { name: 'Lesotho', code: 'LS' },
  { name: 'Liberia', code: 'LR' },
  { name: 'Libya', code: 'LY' },
  { name: 'Liechtenstein', code: 'LI' },
  { name: 'Lithuania', code: 'LT' },
  { name: 'Luxembourg', code: 'LU' },
  { name: 'Madagascar', code: 'MG' },
  { name: 'Malawi', code: 'MW' },
  { name: 'Malaysia', code: 'MY' },
  { name: 'Maldives', code: 'MV' },
  { name: 'Mali', code: 'ML' },
  { name: 'Malta', code: 'MT' },
  { name: 'Marshall Islands', code: 'MH' },
  { name: 'Mauritania', code: 'MR' },
  { name: 'Mauritius', code: 'MU' },
  { name: 'Mexico', code: 'MX' },
  { name: 'Micronesia', code: 'FM' },
  { name: 'Moldova', code: 'MD' },
  { name: 'Monaco', code: 'MC' },
  { name: 'Mongolia', code: 'MN' },
  { name: 'Montenegro', code: 'ME' },
  { name: 'Morocco', code: 'MA' },
  { name: 'Mozambique', code: 'MZ' },
  { name: 'Myanmar', code: 'MM' },
  { name: 'Namibia', code: 'NA' },
  { name: 'Nauru', code: 'NR' },
  { name: 'Nepal', code: 'NP' },
  { name: 'Netherlands', code: 'NL' },
  { name: 'New Zealand', code: 'NZ' },
  { name: 'Nicaragua', code: 'NI' },
  { name: 'Niger', code: 'NE' },
  { name: 'Nigeria', code: 'NG' },
  { name: 'North Korea', code: 'KP' },
  { name: 'North Macedonia', code: 'MK' },
  { name: 'Norway', code: 'NO' },
  { name: 'Oman', code: 'OM' },
  { name: 'Pakistan', code: 'PK' },
  { name: 'Palau', code: 'PW' },
  { name: 'Panama', code: 'PA' },
  { name: 'Papua New Guinea', code: 'PG' },
  { name: 'Paraguay', code: 'PY' },
  { name: 'Peru', code: 'PE' },
  { name: 'Philippines', code: 'PH' },
  { name: 'Poland', code: 'PL' },
  { name: 'Portugal', code: 'PT' },
  { name: 'Qatar', code: 'QA' },
  { name: 'Romania', code: 'RO' },
  { name: 'Russia', code: 'RU' },
  { name: 'Rwanda', code: 'RW' },
  { name: 'Saint Kitts and Nevis', code: 'KN' },
  { name: 'Saint Lucia', code: 'LC' },
  { name: 'Saint Vincent and the Grenadines', code: 'VC' },
  { name: 'Samoa', code: 'WS' },
  { name: 'San Marino', code: 'SM' },
  { name: 'Sao Tome and Principe', code: 'ST' },
  { name: 'Saudi Arabia', code: 'SA' },
  { name: 'Senegal', code: 'SN' },
  { name: 'Serbia', code: 'RS' },
  { name: 'Seychelles', code: 'SC' },
  { name: 'Sierra Leone', code: 'SL' },
  { name: 'Singapore', code: 'SG' },
  { name: 'Slovakia', code: 'SK' },
  { name: 'Slovenia', code: 'SI' },
  { name: 'Solomon Islands', code: 'SB' },
  { name: 'Somalia', code: 'SO' },
  { name: 'South Africa', code: 'ZA' },
  { name: 'South Korea', code: 'KR' },
  { name: 'South Sudan', code: 'SS' },
  { name: 'Spain', code: 'ES' },
  { name: 'Sri Lanka', code: 'LK' },
  { name: 'Sudan', code: 'SD' },
  { name: 'Suriname', code: 'SR' },
  { name: 'Sweden', code: 'SE' },
  { name: 'Switzerland', code: 'CH' },
  { name: 'Syria', code: 'SY' },
  { name: 'Taiwan', code: 'TW' },
  { name: 'Tajikistan', code: 'TJ' },
  { name: 'Tanzania', code: 'TZ' },
  { name: 'Thailand', code: 'TH' },
  { name: 'Timor-Leste', code: 'TL' },
  { name: 'Togo', code: 'TG' },
  { name: 'Tonga', code: 'TO' },
  { name: 'Trinidad and Tobago', code: 'TT' },
  { name: 'Tunisia', code: 'TN' },
  { name: 'Turkey', code: 'TR' },
  { name: 'Turkmenistan', code: 'TM' },
  { name: 'Tuvalu', code: 'TV' },
  { name: 'Uganda', code: 'UG' },
  { name: 'Ukraine', code: 'UA' },
  { name: 'United Arab Emirates', code: 'AE' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'United States', code: 'US' },
  { name: 'Uruguay', code: 'UY' },
  { name: 'Uzbekistan', code: 'UZ' },
  { name: 'Vanuatu', code: 'VU' },
  { name: 'Vatican City', code: 'VA' },
  { name: 'Venezuela', code: 'VE' },
  { name: 'Vietnam', code: 'VN' },
  { name: 'Yemen', code: 'YE' },
  { name: 'Zambia', code: 'ZM' },
  { name: 'Zimbabwe', code: 'ZW' },
];

export function flagEmoji(code: string): string {
  return Array.from(code.toUpperCase())
    .map((c) => String.fromCodePoint(c.charCodeAt(0) + 127397))
    .join('');
}

export const COUNTRY_CITIES: Record<string, string[]> = {
  KE: ['Nairobi','Mombasa','Kisumu','Nakuru','Eldoret','Thika','Malindi','Kitale','Garissa','Nyeri','Machakos','Meru','Kericho','Embu','Kakamega'],
  NG: ['Lagos','Abuja','Kano','Ibadan','Port Harcourt','Benin City','Kaduna','Enugu','Onitsha','Warri','Maiduguri','Jos','Aba','Ilorin','Calabar'],
  GH: ['Accra','Kumasi','Tamale','Sekondi-Takoradi','Cape Coast','Ho','Sunyani','Koforidua','Wa','Bolgatanga','Obuasi','Teshie','Tema','Kasoa'],
  ZA: ['Johannesburg','Cape Town','Durban','Pretoria','Port Elizabeth','Bloemfontein','East London','Polokwane','Nelspruit','Kimberley','Rustenburg','Pietermaritzburg','George','Vereeniging'],
  TZ: ['Dar es Salaam','Dodoma','Mwanza','Arusha','Mbeya','Morogoro','Tanga','Zanzibar City','Kigoma','Tabora','Iringa','Moshi','Shinyanga'],
  UG: ['Kampala','Gulu','Lira','Mbarara','Jinja','Mbale','Entebbe','Masaka','Fort Portal','Soroti','Arua','Kabale','Tororo'],
  ET: ['Addis Ababa','Dire Dawa','Mekelle','Gondar','Hawassa','Bahir Dar','Adama','Jimma','Jijiga','Shashamane','Bishoftu'],
  EG: ['Cairo','Alexandria','Giza','Shubra El Kheima','Port Said','Suez','Luxor','Mansoura','El Mahalla','Tanta','Asyut','Zagazig','Ismailia','Faiyum'],
  MA: ['Casablanca','Rabat','Fes','Marrakech','Tangier','Agadir','Oujda','Kenitra','Tetouan','Safi','Meknes','El Jadida'],
  RW: ['Kigali','Butare','Gitarama','Musanze','Byumba','Cyangugu','Gisenyi','Rwamagana','Nyamata'],
  SN: ['Dakar','Thiès','Kaolack','Saint-Louis','Ziguinchor','Diourbel','Tambacounda','Louga','Kolda'],
  CI: ['Abidjan','Bouaké','Daloa','San-Pédro','Yamoussoukro','Korhogo','Man','Divo','Gagnoa'],
  CM: ['Douala','Yaoundé','Garoua','Kousséri','Bamenda','Bafoussam','Ngaoundéré','Bertoua','Loum'],
  AO: ['Luanda','Huambo','Lobito','Benguela','Namibe','Cabinda','Malanje','Lubango'],
  ZM: ['Lusaka','Kitwe','Ndola','Kabwe','Chingola','Mufulira','Livingstone','Luanshya'],
  MZ: ['Maputo','Matola','Beira','Nampula','Chimoio','Nacala','Quelimane','Tete'],
  TG: ['Lomé','Sokodé','Kara','Palimé','Atakpamé','Bassar','Tsévié'],
  BJ: ['Cotonou','Porto-Novo','Parakou','Djougou','Bohicon','Abomey','Natitingou'],
  BF: ['Ouagadougou','Bobo-Dioulasso','Koudougou','Ouahigouya','Banfora','Kaya'],
  ML: ['Bamako','Sikasso','Mopti','Koutiala','Kayes','Ségou','Gao','Timbuktu'],
  US: ['New York','Los Angeles','Chicago','Houston','Phoenix','Philadelphia','San Antonio','San Diego','Dallas','San Jose','Austin','Jacksonville','Fort Worth','Columbus','Charlotte'],
  GB: ['London','Birmingham','Leeds','Glasgow','Sheffield','Bradford','Liverpool','Edinburgh','Manchester','Bristol','Wakefield','Cardiff','Leicester','Coventry'],
  IN: ['Mumbai','Delhi','Bangalore','Hyderabad','Ahmedabad','Chennai','Kolkata','Pune','Jaipur','Surat','Lucknow','Kanpur','Nagpur','Indore','Thane'],
  CN: ['Shanghai','Beijing','Guangzhou','Shenzhen','Chengdu','Chongqing','Wuhan','Xi\'an','Hangzhou','Tianjin','Nanjing','Dongguan'],
  AE: ['Dubai','Abu Dhabi','Sharjah','Al Ain','Ajman','Ras Al Khaimah','Fujairah','Umm Al Quwain'],
  SA: ['Riyadh','Jeddah','Mecca','Medina','Dammam','Khobar','Tabuk','Buraidah','Khamis Mushait'],
  DE: ['Berlin','Hamburg','Munich','Cologne','Frankfurt','Stuttgart','Düsseldorf','Leipzig','Dortmund','Essen'],
  FR: ['Paris','Marseille','Lyon','Toulouse','Nice','Nantes','Strasbourg','Montpellier','Bordeaux','Lille'],
  CA: ['Toronto','Montreal','Vancouver','Calgary','Edmonton','Ottawa','Winnipeg','Quebec City','Hamilton'],
  AU: ['Sydney','Melbourne','Brisbane','Perth','Adelaide','Gold Coast','Canberra','Newcastle','Hobart'],
  BR: ['São Paulo','Rio de Janeiro','Brasília','Salvador','Fortaleza','Belo Horizonte','Manaus','Curitiba','Recife'],
  JP: ['Tokyo','Osaka','Yokohama','Nagoya','Sapporo','Kobe','Kyoto','Fukuoka','Kawasaki','Saitama'],
};

interface LocationContextValue {
  country: Country;
  setCountry: (country: Country) => void;
  city: string;
  setCity: (city: string) => void;
  cities: string[];
}

const LocationContext = createContext<LocationContextValue>({
  country: { code: 'KE', name: 'Kenya' },
  setCountry: () => {},
  city: '',
  setCity: () => {},
  cities: COUNTRY_CITIES['KE'] || [],
});

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [country, setCountryState] = useState<Country>({ code: 'KE', name: 'Kenya' });
  const [city, setCityState] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('aos_country');
    if (stored) {
      try { setCountryState(JSON.parse(stored)); } catch {}
    }
    const storedCity = localStorage.getItem('aos_city');
    if (storedCity) setCityState(storedCity);
    setMounted(true);
  }, []);

  const setCountry = (c: Country) => {
    setCountryState(c);
    localStorage.setItem('aos_country', JSON.stringify(c));
    setCityState('');
    localStorage.removeItem('aos_city');
  };

  const setCity = (c: string) => {
    setCityState(c);
    localStorage.setItem('aos_city', c);
  };

  const cities = COUNTRY_CITIES[country.code] || [];

  if (!mounted) {
    return (
      <LocationContext.Provider value={{ country, setCountry, city, setCity, cities }}>
        {children}
      </LocationContext.Provider>
    );
  }

  return (
    <LocationContext.Provider value={{ country, setCountry, city, setCity, cities }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext);
}
