import { ReactNode } from 'react';
import { ViewStyle } from 'react-native';

import { AccentHeading } from '@/src/components/onboarding/accent-heading';

type CreateAccountHeaderProps = {
  children: ReactNode;
  style?: ViewStyle;
};

export function CreateAccountHeader({ children, style }: CreateAccountHeaderProps) {
  return <AccentHeading style={style}>{children}</AccentHeading>;
}
