import Svg, { Path, Rect } from 'react-native-svg';

import { AppleIcon, GoogleIcon } from '@/src/components/onboarding/social-icons';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';

type CalendarBrandIconProps = {
  size?: number;
};

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
      return <OutlookIcon size={size} />;
  }
}

export function OutlookIcon({ size = 24 }: CalendarBrandIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x="2" y="4" width="20" height="16" rx="2" fill="#0078D4" />
      <Path
        fill="#FFFFFF"
        d="M13 8h5v8h-5V8zm-2 0H6l3 4-3 4h5V8z"
      />
    </Svg>
  );
}
