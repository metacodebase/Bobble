import { AppleIcon, GoogleIcon, MicrosoftIcon } from '@/src/components/onboarding/social-icons';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';

export type CalendarProvider = 'google' | 'apple' | 'outlook';

export function CalendarProviderIcon({
  provider,
  size = 24,
}: {
  provider: CalendarProvider;
  size?: number;
}) {
  const colors = useBobbleColors();

  switch (provider) {
    case 'google':
      return <GoogleIcon size={size} />;
    case 'apple':
      return <AppleIcon size={size} color={colors.text} />;
    case 'outlook':
      return <MicrosoftIcon size={size} />;
  }
}
