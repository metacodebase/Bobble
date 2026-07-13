import { BobbleIcon } from '@/src/components/ui/bobble-icon';

type BobblesTabIconProps = {
  focused: boolean;
  size?: number;
  color?: string;
};

export function BobblesTabIcon({ focused, size, color }: BobblesTabIconProps) {
  return (
    <BobbleIcon
      size={size}
      variant={focused ? 'active' : 'inactive'}
      inactiveColor={color}
    />
  );
}
