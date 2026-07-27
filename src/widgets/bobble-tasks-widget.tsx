'use no memo';

import React from 'react';
import { FlexWidget, ImageWidget, TextWidget } from 'react-native-android-widget';

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

const ROOT_STYLE = {
  height: 'match_parent' as const,
  width: 'match_parent' as const,
  borderRadius: 24,
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
 * iOS systemSmall — single column, no OverlapWidget (Android RemoteViews is flaky with overlays).
 * Text top-left, mascot bottom-right, same content as SwiftUI smallView.
 */
function SmallWidget({ payload }: { payload: WidgetPayload | null }) {
  const { mascot, headline, subtitle } = derive(payload);

  return (
    <FlexWidget
      clickAction="OPEN_URI"
      clickActionData={{ uri: WIDGET_DEEP_LINK }}
      accessibilityLabel="Bobble tasks"
      style={{
        ...ROOT_STYLE,
        flexDirection: 'column',
        padding: 14,
      }}
    >
      <TextWidget
        text="Today's Tasks"
        allowFontScaling={false}
        style={{ fontFamily: WidgetFonts.regular, fontSize: 11, color: '#F3E8FF' }}
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
      <FlexWidget style={{ flex: 1, height: 8, width: 'match_parent' }} />
      <FlexWidget
        style={{
          width: 'match_parent',
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}
      >
        <TextWidget
          text={subtitle}
          maxLines={2}
          allowFontScaling={false}
          style={{
            fontFamily: WidgetFonts.regular,
            fontSize: 11,
            color: '#FFFFFF',
            paddingRight: 8,
          }}
        />
        <ImageWidget image={mascot} imageWidth={64} imageHeight={64} resizeMode="contain" />
      </FlexWidget>
    </FlexWidget>
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
          style={{ fontFamily: WidgetFonts.regular, fontSize: 12, color: '#F3E8FF' }}
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
      <ImageWidget image={mascot} imageWidth={92} imageHeight={92} resizeMode="contain" />
    </FlexWidget>
  );
}
