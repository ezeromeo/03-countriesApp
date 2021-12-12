import { HttpStatusCode } from '@angular/common/http';
// To parse this data:
//
//   import { Convert } from "./file";
//
//   const Country = Convert.toCountry(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Country {
  name:           string;
  topLevelDomain: string[];
  alpha2Code:     string;
  alpha3Code:     string;
  callingCodes:   string[];
  capital?:       string;
  altSpellings?:  string[];
  subregion:      string;
  region:         Region;
  population:     number;
  latlng?:        number[];
  demonym:        string;
  area?:          number;
  timezones:      string[];
  borders?:       string[];
  nativeName:     string;
  numericCode:    string;
  flags:          Flags;
  currencies?:    Currency[];
  languages:      Language[];
  translations:   Translations;
  flag:           string;
  regionalBlocs?: RegionalBloc[];
  cioc?:          string;
  independent:    boolean;
  gini?:          number;
}

export interface Currency {
  code:   string;
  name:   string;
  symbol: string;
}

export interface Flags {
  svg: string;
  png: string;
}

export interface Language {
  iso639_1?:   string;
  iso639_2:    string;
  name:        string;
  nativeName?: string;
}

export enum Region {
  Africa = "Africa",
  Americas = "Americas",
  Antarctic = "Antarctic",
  AntarcticOcean = "Antarctic Ocean",
  Asia = "Asia",
  Europe = "Europe",
  Oceania = "Oceania",
  Polar = "Polar",
}

export interface RegionalBloc {
  acronym:        Acronym;
  name:           Name;
  otherNames?:    OtherName[];
  otherAcronyms?: OtherAcronym[];
}

export enum Acronym {
  Al = "AL",
  Asean = "ASEAN",
  Au = "AU",
  Cais = "CAIS",
  Caricom = "CARICOM",
  Cefta = "CEFTA",
  Eeu = "EEU",
  Efta = "EFTA",
  Eu = "EU",
  Nafta = "NAFTA",
  Pa = "PA",
  Saarc = "SAARC",
  Usan = "USAN",
}

export enum Name {
  AfricanUnion = "African Union",
  ArabLeague = "Arab League",
  AssociationOfSoutheastAsianNations = "Association of Southeast Asian Nations",
  CaribbeanCommunity = "Caribbean Community",
  CentralAmericanIntegrationSystem = "Central American Integration System",
  CentralEuropeanFreeTradeAgreement = "Central European Free Trade Agreement",
  EurasianEconomicUnion = "Eurasian Economic Union",
  EuropeanFreeTradeAssociation = "European Free Trade Association",
  EuropeanUnion = "European Union",
  NorthAmericanFreeTradeAgreement = "North American Free Trade Agreement",
  PacificAlliance = "Pacific Alliance",
  SouthAsianAssociationForRegionalCooperation = "South Asian Association for Regional Cooperation",
  UnionOfSouthAmericanNations = "Union of South American Nations",
}

export enum OtherAcronym {
  Eaeu = "EAEU",
  Sica = "SICA",
  Unasul = "UNASUL",
  Unasur = "UNASUR",
  Uzan = "UZAN",
}

export enum OtherName {
  AccordDeLibreÉchangeNordAméricain = "Accord de Libre-échange Nord-Américain",
  AlianzaDelPacífico = "Alianza del Pacífico",
  CaribischeGemeenschap = "Caribische Gemeenschap",
  CommunautéCaribéenne = "Communauté Caribéenne",
  ComunidadDelCaribe = "Comunidad del Caribe",
  JāmiAtAdDuwalAlArabīyah = "Jāmiʻat ad-Duwal al-ʻArabīyah",
  LeagueOfArabStates = "League of Arab States",
  SistemaDeLaIntegraciónCentroamericana = "Sistema de la Integración Centroamericana,",
  SouthAmericanUnion = "South American Union",
  TratadoDeLibreComercioDeAméricaDelNorte = "Tratado de Libre Comercio de América del Norte",
  UmojaWaAfrika = "Umoja wa Afrika",
  UnieVanZuidAmerikaanseNaties = "Unie van Zuid-Amerikaanse Naties",
  UnionAfricaine = "Union africaine",
  UniãoAfricana = "União Africana",
  UniãoDeNaçõesSulAmericanas = "União de Nações Sul-Americanas",
  UniónAfricana = "Unión Africana",
  UniónDeNacionesSuramericanas = "Unión de Naciones Suramericanas",
  الاتحادالأفريقي = "الاتحاد الأفريقي",
  جامعةالدولالعربية = "جامعة الدول العربية",
}

export interface Translations {
  br:  string;
  pt:  string;
  nl:  string;
  hr:  string;
  fa?: string;
  de:  string;
  es:  string;
  fr:  string;
  ja:  string;
  it:  string;
  hu:  string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toCountry(json: string): Country[] {
      return cast(JSON.parse(json), a(r("Country")));
  }

  public static CountryToJson(value: Country[]): string {
      return JSON.stringify(uncast(value, a(r("Country"))), null, 2);
  }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
  if (key) {
      throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`);
  }
  throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`, );
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
      const map: any = {};
      typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
      typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
      const map: any = {};
      typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
      typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
  function transformPrimitive(typ: string, val: any): any {
      if (typeof typ === typeof val) return val;
      return invalidValue(typ, val, key);
  }

  function transformUnion(typs: any[], val: any): any {
      // val must validate against one typ in typs
      const l = typs.length;
      for (let i = 0; i < l; i++) {
          const typ = typs[i];
          try {
              return transform(val, typ, getProps);
          } catch (_) {}
      }
      return invalidValue(typs, val);
  }

  function transformEnum(cases: string[], val: any): any {
      if (cases.indexOf(val) !== -1) return val;
      return invalidValue(cases, val);
  }

  function transformArray(typ: any, val: any): any {
      // val must be an array with no invalid elements
      if (!Array.isArray(val)) return invalidValue("array", val);
      return val.map(el => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
      if (val === null) {
          return null;
      }
      const d = new Date(val);
      if (isNaN(d.valueOf())) {
          return invalidValue("Date", val);
      }
      return d;
  }

  function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
      if (val === null || typeof val !== "object" || Array.isArray(val)) {
          return invalidValue("object", val);
      }
      const result: any = {};
      Object.getOwnPropertyNames(props).forEach(key => {
          const prop = props[key];
          const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
          result[prop.key] = transform(v, prop.typ, getProps, prop.key);
      });
      Object.getOwnPropertyNames(val).forEach(key => {
          if (!Object.prototype.hasOwnProperty.call(props, key)) {
              result[key] = transform(val[key], additional, getProps, key);
          }
      });
      return result;
  }

  if (typ === "any") return val;
  if (typ === null) {
      if (val === null) return val;
      return invalidValue(typ, val);
  }
  if (typ === false) return invalidValue(typ, val);
  while (typeof typ === "object" && typ.ref !== undefined) {
      typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === "object") {
      return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
          : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
          : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
          : invalidValue(typ, val);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== "number") return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  "Country": o([
      { json: "name", js: "name", typ: "" },
      { json: "topLevelDomain", js: "topLevelDomain", typ: a("") },
      { json: "alpha2Code", js: "alpha2Code", typ: "" },
      { json: "alpha3Code", js: "alpha3Code", typ: "" },
      { json: "callingCodes", js: "callingCodes", typ: a("") },
      { json: "capital", js: "capital", typ: u(undefined, "") },
      { json: "altSpellings", js: "altSpellings", typ: u(undefined, a("")) },
      { json: "subregion", js: "subregion", typ: "" },
      { json: "region", js: "region", typ: r("Region") },
      { json: "population", js: "population", typ: 0 },
      { json: "latlng", js: "latlng", typ: u(undefined, a(3.14)) },
      { json: "demonym", js: "demonym", typ: "" },
      { json: "area", js: "area", typ: u(undefined, 3.14) },
      { json: "timezones", js: "timezones", typ: a("") },
      { json: "borders", js: "borders", typ: u(undefined, a("")) },
      { json: "nativeName", js: "nativeName", typ: "" },
      { json: "numericCode", js: "numericCode", typ: "" },
      { json: "flags", js: "flags", typ: r("Flags") },
      { json: "currencies", js: "currencies", typ: u(undefined, a(r("Currency"))) },
      { json: "languages", js: "languages", typ: a(r("Language")) },
      { json: "translations", js: "translations", typ: r("Translations") },
      { json: "flag", js: "flag", typ: "" },
      { json: "regionalBlocs", js: "regionalBlocs", typ: u(undefined, a(r("RegionalBloc"))) },
      { json: "cioc", js: "cioc", typ: u(undefined, "") },
      { json: "independent", js: "independent", typ: true },
      { json: "gini", js: "gini", typ: u(undefined, 3.14) },
  ], false),
  "Currency": o([
      { json: "code", js: "code", typ: "" },
      { json: "name", js: "name", typ: "" },
      { json: "symbol", js: "symbol", typ: "" },
  ], false),
  "Flags": o([
      { json: "svg", js: "svg", typ: "" },
      { json: "png", js: "png", typ: "" },
  ], false),
  "Language": o([
      { json: "iso639_1", js: "iso639_1", typ: u(undefined, "") },
      { json: "iso639_2", js: "iso639_2", typ: "" },
      { json: "name", js: "name", typ: "" },
      { json: "nativeName", js: "nativeName", typ: u(undefined, "") },
  ], false),
  "RegionalBloc": o([
      { json: "acronym", js: "acronym", typ: r("Acronym") },
      { json: "name", js: "name", typ: r("Name") },
      { json: "otherNames", js: "otherNames", typ: u(undefined, a(r("OtherName"))) },
      { json: "otherAcronyms", js: "otherAcronyms", typ: u(undefined, a(r("OtherAcronym"))) },
  ], false),
  "Translations": o([
      { json: "br", js: "br", typ: "" },
      { json: "pt", js: "pt", typ: "" },
      { json: "nl", js: "nl", typ: "" },
      { json: "hr", js: "hr", typ: "" },
      { json: "fa", js: "fa", typ: u(undefined, "") },
      { json: "de", js: "de", typ: "" },
      { json: "es", js: "es", typ: "" },
      { json: "fr", js: "fr", typ: "" },
      { json: "ja", js: "ja", typ: "" },
      { json: "it", js: "it", typ: "" },
      { json: "hu", js: "hu", typ: "" },
  ], false),
  "Region": [
      "Africa",
      "Americas",
      "Antarctic",
      "Antarctic Ocean",
      "Asia",
      "Europe",
      "Oceania",
      "Polar",
  ],
  "Acronym": [
      "AL",
      "ASEAN",
      "AU",
      "CAIS",
      "CARICOM",
      "CEFTA",
      "EEU",
      "EFTA",
      "EU",
      "NAFTA",
      "PA",
      "SAARC",
      "USAN",
  ],
  "Name": [
      "African Union",
      "Arab League",
      "Association of Southeast Asian Nations",
      "Caribbean Community",
      "Central American Integration System",
      "Central European Free Trade Agreement",
      "Eurasian Economic Union",
      "European Free Trade Association",
      "European Union",
      "North American Free Trade Agreement",
      "Pacific Alliance",
      "South Asian Association for Regional Cooperation",
      "Union of South American Nations",
  ],
  "OtherAcronym": [
      "EAEU",
      "SICA",
      "UNASUL",
      "UNASUR",
      "UZAN",
  ],
  "OtherName": [
      "Accord de Libre-échange Nord-Américain",
      "Alianza del Pacífico",
      "Caribische Gemeenschap",
      "Communauté Caribéenne",
      "Comunidad del Caribe",
      "Jāmiʻat ad-Duwal al-ʻArabīyah",
      "League of Arab States",
      "Sistema de la Integración Centroamericana,",
      "South American Union",
      "Tratado de Libre Comercio de América del Norte",
      "Umoja wa Afrika",
      "Unie van Zuid-Amerikaanse Naties",
      "Union africaine",
      "União Africana",
      "União de Nações Sul-Americanas",
      "Unión Africana",
      "Unión de Naciones Suramericanas",
      "الاتحاد الأفريقي",
      "جامعة الدول العربية",
  ],
};
