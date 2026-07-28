'use no memo';

import React from 'react';
import { FlexWidget, ImageWidget, OverlapWidget, TextWidget } from 'react-native-android-widget';

import {
  WIDGET_DEEP_LINK,
  type WidgetMood,
  type WidgetPayload,
} from '@/src/features/widget/widget-data';
import { WidgetFonts } from '@/src/widgets/widget-fonts';

const MASCOTS: Record<WidgetMood, number> = {
  empty: require('@/src/assets/images/bobble-sound.png'),
  starting: require('@/src/assets/images/bobble-writing.png'),
  working: require('@/src/assets/images/bobble-hammer.png'),
  almost: require('@/src/assets/images/bobble-nerd.png'),
  done: require('@/src/assets/images/mascot/bobble-greet.png'),
};

/** Match iOS widget gradient (targets/widget/index.swift). */
const GRADIENT = {
  from: '#9F52F2',
  to: '#D8B4FE',
  orientation: 'TL_BR',
} as const;

/** Large enough to fill the lower-right of Android's 2×2 cell (iOS uses 64pt overlay). */
const SMALL_MASCOT = 96;
/** Keep subtitle clear of the overlaid mascot. */
const SMALL_SUBTITLE_TRAILING = 88;

const ROOT_STYLE = {
  height: 'match_parent' as const,
  width: 'match_parent' as const,
  borderRadius: 24,
  overflow: 'hidden' as const,
  backgroundColor: '#9F52F2' as const,
  backgroundGradient: GRADIENT,
};

export type BobbleWidgetVariant = 'small' | 'medium';

type BobbleTasksWidgetProps = {
  payload: WidgetPayload | null;
  variant: BobbleWidgetVariant;
};

function derive(payload: WidgetPayload | null) {
  const mood: WidgetMood = payload?.mood ?? 'empty';
  const headline = payload && payload.total > 0 ? `${payload.completed}/${payload.total}` : 'Hi there!';
  const subtitle = payload ? payload.message : 'Open Bobble to plan your day';
  const nextTask =
    payload && payload.nextTaskTitle
      ? payload.nextTaskTime
        ? `Next: ${payload.nextTaskTitle} · ${payload.nextTaskTime}`
        : `Next: ${payload.nextTaskTitle}`
      : '';
  const progress = payload && payload.total > 0 ? Math.min(payload.completed / payload.total, 1) : 0;
  return { mascot: MASCOTS[mood], headline, subtitle, nextTask, progress };
}

/** Exact Android twin of the iOS small (2×2) and medium (4×2) Bobble widgets. */
export function BobbleTasksWidget({ payload, variant }: BobbleTasksWidgetProps) {
  if (variant === 'small') {
    return <SmallWidget payload={payload} />;
  }
  return <MediumWidget payload={payload} />;
}

/**
 * Android 2×2 cells are taller than iOS systemSmall, so we cluster copy at the
 * top (no spacer) and overlay a large mascot to fill the lower-right instead
 * of leaving a purple void between count and message.
 */
function SmallWidget({ payload }: { payload: WidgetPayload | null }) {
  const { mascot, headline, subtitle } = derive(payload);

  return (
    <OverlapWidget
      clickAction="OPEN_URI"
      clickActionData={{ uri: WIDGET_DEEP_LINK }}
      accessibilityLabel="Bobble tasks"
      style={ROOT_STYLE}
    >
      <FlexWidget
        style={{
          height: 'match_parent',
          width: 'match_parent',
          flexDirection: 'column',
          paddingTop: 12,
          paddingHorizontal: 12,
          paddingBottom: 10,
        }}
      >
        <TextWidget
          text="Today's Tasks"
          allowFontScaling={false}
          style={{ fontFamily: WidgetFonts.regular, fontSize: 20, color: '#F3E8FF' }}
        />
        <TextWidget
          text={headline}
          allowFontScaling={false}
          style={{
            fontFamily: WidgetFonts.regular,
            fontSize: 30,
            color: '#FFFFFF',
            marginTop: 2,
          }}
        />
        <TextWidget
          text={subtitle}
          maxLines={2}
          truncate="END"
          allowFontScaling={false}
          style={{
            fontFamily: WidgetFonts.regular,
            fontSize: 11,
            color: '#FFFFFF',
            marginTop: 6,
            paddingRight: SMALL_SUBTITLE_TRAILING,
          }}
        />
      </FlexWidget>
      <FlexWidget
        style={{
          height: 'match_parent',
          width: 'match_parent',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          paddingRight: 2,
          paddingBottom: 2,
        }}
      >
        <ImageWidget
          image={mascot}
          imageWidth={SMALL_MASCOT}
          imageHeight={SMALL_MASCOT}
          resizeMode="contain"
        />
      </FlexWidget>
    </OverlapWidget>
  );
}

/** iOS systemMedium — text + progress left, mascot right. */
function MediumWidget({ payload }: { payload: WidgetPayload | null }) {
  const { mascot, headline, subtitle, nextTask, progress } = derive(payload);
  const fillWeight = Math.max(0, Math.min(100, Math.round(progress * 100)));

  return (
    <FlexWidget
      clickAction="OPEN_URI"
      clickActionData={{ uri: WIDGET_DEEP_LINK }}
      accessibilityLabel="Bobble tasks"
      style={{
        ...ROOT_STYLE,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 14,
      }}
    >
      <FlexWidget
        style={{
          flex: 1,
          height: 'match_parent',
          width: 'match_parent',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          marginRight: 10,
        }}
      >
        <TextWidget
          text="Today's Tasks"
          allowFontScaling={false}
          style={{ fontFamily: WidgetFonts.regular, fontSize: 20, color: '#F3E8FF' }}
        />
        <TextWidget
          text={headline}
          allowFontScaling={false}
          style={{
            fontFamily: WidgetFonts.regular,
            fontSize: 28,
            color: '#FFFFFF',
            marginTop: 2,
          }}
        />
        <TextWidget
          text={subtitle}
          truncate="END"
          maxLines={1}
          allowFontScaling={false}
          style={{
            fontFamily: WidgetFonts.regular,
            fontSize: 13,
            color: '#FFFFFF',
            marginTop: 2,
          }}
        />
        {nextTask ? (
          <TextWidget
            text={nextTask}
            truncate="END"
            maxLines={1}
            allowFontScaling={false}
            style={{
              fontFamily: WidgetFonts.regular,
              fontSize: 11,
              color: '#F3E8FF',
              marginTop: 2,
            }}
          />
        ) : null}
        <FlexWidget
          style={{
            width: 'match_parent',
            height: 6,
            flexDirection: 'row',
            borderRadius: 3,
            backgroundColor: '#FFFFFF59',
            marginTop: 8,
          }}
        >
          <FlexWidget
            style={{
              flex: Math.max(fillWeight, 1),
              height: 'match_parent',
              width: 'wrap_content',
              borderRadius: 3,
              backgroundColor: fillWeight > 0 ? '#FFFFFF' : '#FFFFFF00',
            }}
          />
          <FlexWidget
            style={{
              flex: Math.max(100 - fillWeight, 1),
              height: 'match_parent',
              width: 'wrap_content',
              backgroundColor: '#FFFFFF00',
            }}
          />
        </FlexWidget>
      </FlexWidget>
      <ImageWidget image={mascot} imageWidth={84} imageHeight={84} resizeMode="contain" />
    </FlexWidget>
  );
}
