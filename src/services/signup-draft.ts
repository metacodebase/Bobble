import { secureStorage } from '@/src/services/secure-storage';

const SIGNUP_DRAFT_KEY = 'bobble-signup-draft-v1';
const DRAFT_MAX_AGE_MS = 7 * 24 * 60 * 60_000;

export interface SignupDraft {
  step: number;
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  dobIso: string;
  timeZoneId: string;
  selectedGoals: string[];
  acceptedTerms: boolean;
  emailVerificationToken?: string;
  verificationExpiresAt?: string;
  updatedAt: string;
}

export async function loadSignupDraft(): Promise<SignupDraft | null> {
  try {
    const raw = await secureStorage.getItem(SIGNUP_DRAFT_KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw) as SignupDraft;
    if (
      !draft.email ||
      !draft.updatedAt ||
      Date.now() - new Date(draft.updatedAt).getTime() > DRAFT_MAX_AGE_MS
    ) {
      await clearSignupDraft();
      return null;
    }
    return draft;
  } catch {
    await clearSignupDraft();
    return null;
  }
}

export async function saveSignupDraft(draft: Omit<SignupDraft, 'updatedAt'>): Promise<void> {
  await secureStorage.setItem(
    SIGNUP_DRAFT_KEY,
    JSON.stringify({ ...draft, updatedAt: new Date().toISOString() })
  );
}

export async function clearSignupDraft(): Promise<void> {
  await secureStorage.removeItem(SIGNUP_DRAFT_KEY);
}
