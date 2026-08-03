export type TimeZoneOption = {
  /** IANA timezone identifier, used as a stable id */
  id: string;
  /** Human-friendly label including the GMT offset */
  label: string;
};

/** A curated list of commonly used time zones. */
export const TIME_ZONES: TimeZoneOption[] = [
  { id: 'Pacific/Midway', label: '(GMT-11:00) Midway Island' },
  { id: 'Pacific/Honolulu', label: '(GMT-10:00) Hawaii' },
  { id: 'America/Anchorage', label: '(GMT-09:00) Alaska' },
  { id: 'America/Los_Angeles', label: '(GMT-08:00) Pacific Time (US & Canada)' },
  { id: 'America/Denver', label: '(GMT-07:00) Mountain Time (US & Canada)' },
  { id: 'America/Chicago', label: '(GMT-06:00) Central Time (US & Canada)' },
  { id: 'America/New_York', label: '(GMT-05:00) Eastern Time (US & Canada)' },
  { id: 'America/Caracas', label: '(GMT-04:00) Caracas' },
  { id: 'America/Sao_Paulo', label: '(GMT-03:00) Brasilia' },
  { id: 'Atlantic/Azores', label: '(GMT-01:00) Azores' },
  { id: 'Europe/London', label: '(GMT+00:00) London, Dublin' },
  { id: 'Europe/Paris', label: '(GMT+01:00) Paris, Berlin, Madrid' },
  { id: 'Europe/Athens', label: '(GMT+02:00) Athens, Cairo' },
  { id: 'Europe/Moscow', label: '(GMT+03:00) Moscow, Istanbul' },
  { id: 'Asia/Dubai', label: '(GMT+04:00) Abu Dhabi, Dubai' },
  { id: 'Asia/Karachi', label: '(GMT+05:00) Karachi, Islamabad' },
  { id: 'Asia/Kolkata', label: '(GMT+05:30) India Standard Time' },
  { id: 'Asia/Dhaka', label: '(GMT+06:00) Dhaka' },
  { id: 'Asia/Bangkok', label: '(GMT+07:00) Bangkok, Jakarta' },
  { id: 'Asia/Shanghai', label: '(GMT+08:00) Beijing, Singapore' },
  { id: 'Asia/Tokyo', label: '(GMT+09:00) Tokyo, Seoul' },
  { id: 'Australia/Sydney', label: '(GMT+10:00) Sydney, Melbourne' },
  { id: 'Pacific/Auckland', label: '(GMT+12:00) Auckland' },
];

function getUtcOffsetMinutes(timeZoneId: string, at: Date = new Date()): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timeZoneId,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(at);

  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);

  const asUtc = Date.UTC(
    value('year'),
    value('month') - 1,
    value('day'),
    value('hour'),
    value('minute'),
    value('second'),
  );

  return (asUtc - at.getTime()) / 60_000;
}

/**
 * Resolves the device timezone to the closest curated option.
 * Prefers an exact IANA match, then falls back to matching the current UTC offset.
 */
export function getDeviceTimeZone(): TimeZoneOption {
  const deviceId = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const exact = TIME_ZONES.find((tz) => tz.id === deviceId);
  if (exact) return exact;

  try {
    const deviceOffset = getUtcOffsetMinutes(deviceId);
    const byOffset = TIME_ZONES.find((tz) => getUtcOffsetMinutes(tz.id) === deviceOffset);
    if (byOffset) return byOffset;
  } catch {
    // Invalid/unknown timezone ids fall through to the default below.
  }

  return TIME_ZONES[0];
}

export const DEFAULT_TIME_ZONE: TimeZoneOption = getDeviceTimeZone();
