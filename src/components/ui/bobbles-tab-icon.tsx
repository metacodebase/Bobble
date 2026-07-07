import { BobbleIcon } from '@/src/components/ui/bobble-icon';

type BobblesTabIconProps = {
  focused: boolean;
  size?: number;
};

export function BobblesTabIcon({ focused, size }: BobblesTabIconProps) {
  return <BobbleIcon size={size} variant={focused ? 'active' : 'inactive'} />;
}
