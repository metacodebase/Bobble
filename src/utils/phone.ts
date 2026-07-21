import { COUNTRIES, DEFAULT_COUNTRY, type Country } from '@/src/data/countries';

export function parseStoredPhone(stored: string): { country: Country; localNumber: string } {
  const trimmed = stored.trim();
  if (!trimmed) {
    return { country: DEFAULT_COUNTRY, localNumber: '' };
  }

  const normalized = trimmed.startsWith('+')
    ? trimmed
    : `+${trimmed.replace(/\D/g, '')}`;

  const sorted = [...COUNTRIES].sort((a, b) => b.dialCode.length - a.dialCode.length);
  for (const country of sorted) {
    if (normalized.startsWith(country.dialCode)) {
      const localNumber = normalized.slice(country.dialCode.length).trim();
      return { country, localNumber };
    }
  }

  return { country: DEFAULT_COUNTRY, localNumber: trimmed };
}

export function formatStoredPhone(country: Country, localNumber: string): string {
  const trimmed = localNumber.trim();
  if (!trimmed) return '';
  return `${country.dialCode} ${trimmed}`;
}
