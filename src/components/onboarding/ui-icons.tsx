import Svg, { Circle, Path, Rect } from 'react-native-svg';

type UiIconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export function CheckIcon({ size = 20, color = '#FFFFFF', strokeWidth = 3.5 }: UiIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 12.5l4 4L18 8.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function CameraIcon({ size = 20, color = '#FFFFFF' }: UiIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 8.5V18a2 2 0 002 2h12a2 2 0 002-2V8.5a2 2 0 00-2-2h-2.2l-1.2-1.8A2 2 0 0013.1 3h-2.2a2 2 0 00-1.5.7L8.2 5.5H6a2 2 0 00-2 2z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Circle cx={12} cy={12.5} r={3.2} stroke={color} strokeWidth={1.8} />
    </Svg>
  );
}

export function ChevronDownIcon({ size = 20, color = '#6B7280' }: UiIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 9l6 6 6-6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function CalendarOutlineIcon({ size = 20, color = '#6B7280' }: UiIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={4} y={5.5} width={16} height={14} rx={2.5} stroke={color} strokeWidth={1.8} />
      <Path d="M4 10h16M8 3.5v4M16 3.5v4" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

export function ProductivityIcon({ size = 22, color = '#7C5CFF' }: UiIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 18V6M4 18h16M8 14l3-3 3 2 5-6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function LeafIcon({ size = 22, color = '#7C5CFF' }: UiIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 20c5-4 7-8.5 7-13a7 7 0 00-7 7c0 5.5-2.5 9.5-7 13 5-4 7-8.5 7-13a7 7 0 00-7-7c0 5.5-2.5 9.5-7 13z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function OrganizeIcon({ size = 22, color = '#7C5CFF' }: UiIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={4} y={5} width={16} height={15} rx={2.5} stroke={color} strokeWidth={1.8} />
      <Path d="M4 10h16M8 3.5v4M16 3.5v4" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

export function GrowthIcon({ size = 22, color = '#7C5CFF' }: UiIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9.5 18a5.5 5.5 0 110-11 5.5 5.5 0 010 11z"
        stroke={color}
        strokeWidth={1.8}
      />
      <Path
        d="M14 10c2 0 4 1.5 4.5 4M14 14c1.5 0 3 1 3.5 3"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export type GoalIconId = 'productive' | 'stress' | 'organised' | 'growth';

export function GoalIcon({
  id,
  size = 22,
  color = '#7C5CFF',
}: UiIconProps & { id: GoalIconId }) {
  switch (id) {
    case 'productive':
      return <ProductivityIcon size={size} color={color} />;
    case 'stress':
      return <LeafIcon size={size} color={color} />;
    case 'organised':
      return <OrganizeIcon size={size} color={color} />;
    case 'growth':
      return <GrowthIcon size={size} color={color} />;
  }
}
