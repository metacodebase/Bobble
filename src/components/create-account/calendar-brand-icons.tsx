import Svg, { Path, Rect } from 'react-native-svg';

type CalendarBrandIconProps = {
  size?: number;
};

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
