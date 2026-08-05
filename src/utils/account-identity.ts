const INTERNAL_X_EMAIL = /^x_[^@]+@x\.bobble\.local$/i;

export function visibleAccountEmail(email?: string): string | undefined {
  const value = email?.trim();
  return value && !INTERNAL_X_EMAIL.test(value) ? value : undefined;
}

export function xAccountLabel(handle?: string): string {
  const value = handle?.trim().replace(/^@/, '');
  return value ? `@${value}` : 'X account';
}
