import { BobbleIcon } from '@/src/components/ui/bobble-icon';

type BobblesTabIconProps = {
  focused: boolean;
};

export function BobblesTabIcon({ focused }: BobblesTabIconProps) {
  return <BobbleIcon size={26} variant={focused ? 'active' : 'inactive'} />;
}
