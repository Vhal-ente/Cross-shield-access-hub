// lib/phoneCodes.ts
export function phoneCodeForCountry(iso2?: string) {
  if (!iso2) return undefined;
  const map: Record<string, string> = {
    NG: "+234",
    US: "+1",
    GB: "+44",
    CA: "+1",
    KE: "+254",
    GH: "+233",
    ZA: "+27",
    EG: "+20",
    FR: "+33",
    DE: "+49",
    IT: "+39",
    ES: "+34",
    BR: "+55",
    IN: "+91",
    CN: "+86",
    JP: "+81",
    AU: "+61",
    MX: "+52",
    RU: "+7",
    AR: "+54",
    PK: "+92"
  };
  return map[iso2.toUpperCase()];
}
