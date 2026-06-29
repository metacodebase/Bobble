import { ReactNode } from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

type AccentHeadingProps = {
  children: ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export function AccentHeading({ children, style, textStyle }: AccentHeadingProps) {
  const colors = useBobbleColors();

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.heading, { color: colors.text }, textStyle]}>{children}</Text>
    </View>
  );
}

type AccentTextProps = {
  children: ReactNode;
};

export function AccentText({ children }: AccentTextProps) {
  const colors = useBobbleColors();

  return (
    <Text style={[Typography.accentSubtitle, { color: colors.textAccent }]}>{children}</Text>
  );
}

type WordAccentHeadingProps = {
  text: string;
  accentWords: readonly string[];
  style?: ViewStyle;
  textStyle?: TextStyle;
  skipAccent?: (word: string, index: number) => boolean;
};

export function WordAccentHeading({
  text,
  accentWords,
  style,
  textStyle,
  skipAccent,
}: WordAccentHeadingProps) {
  const colors = useBobbleColors();
  const tokens = text.split(/(\s+)/);

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.heading, { color: colors.text }, textStyle]}>
        {tokens.map((token, index) => {
          const cleanWord = token.replace(/[^a-zA-Z']/g, '').toLowerCase();
          const isAccent =
            accentWords.includes(cleanWord) && !(skipAccent?.(cleanWord, index) ?? false);

          return (
            <Text key={index} style={isAccent ? { color: colors.textAccent } : undefined}>
              {token}
            </Text>
          );
        })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  heading: {
    ...Typography.heading,
  },
});
