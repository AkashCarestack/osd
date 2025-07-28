import { geolocation, ipAddress } from "@vercel/edge";
import type { NextFetchEvent, NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import countries from '../../lib/countries.json'


export const config = {
 runtime: 'edge',
};

export default function UserGeoLocation(
 request: NextRequest,
 context: NextFetchEvent,
) {
  const { nextUrl: url, geo } = request
  if(!geo ){
    return
  }
  const country = geo.country || 'US'
  const city = geo.city || 'San Francisco'
  const region = geo.region || 'CA'
  const ip = ipAddress(request) || "unknown";

  const countryInfo:any = countries.find((x) => x.cca2 === country)
  const currencyCode = Object.keys(countryInfo.currencies)[0]
  const currency = countryInfo.currencies[currencyCode]
  const languages = Object.values(countryInfo.languages).join(', ')
  return NextResponse.json({
    country, city, region, currencyCode, currency, languages,ip
  });
}