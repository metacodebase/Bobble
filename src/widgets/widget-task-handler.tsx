'use no memo';

import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { FlexWidget, TextWidget, type WidgetTaskHandlerProps } from 'react-native-android-widget';

import {
  getLocalDayKey,
  WIDGET_PAYLOAD_KEY,
  type WidgetPayload,
} from '@/src/features/widget/widget-data';
import { BobbleTasksWidget, type BobbleWidgetVariant } from '@/src/widgets/bobble-tasks-widget';

/** Maps widget names from app.json plugin config to layout variants. */
const WIDGET_VARIANTS: Record<string, BobbleWidgetVariant> = {
  BobbleTasksSmall: 'small',
  BobbleTasks: 'medium',
};

async function loadTodayPayload(): Promise<WidgetPayload | null> {
  try {
    const raw = await AsyncStorage.getItem(WIDGET_PAYLOAD_KEY);
    if (!raw) return null;
    const payload = JSON.parse(raw) as WidgetPayload;
    return payload.dayKey === getLocalDayKey() ? payload : null;
  } catch {
    return null;
  }
}

function FallbackWidget() {
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        height: 'match_parent',
        width: 'match_parent',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 24,
        backgroundColor: '#9F52F2',
      }}
    >
      <TextWidget text="Open Bobble" style={{ fontSize: 14, fontWeight: 'bold', color: '#FFFFFF' }} />
    </FlexWidget>
  );
}

/**
 * Runs headlessly when Android asks the widget to draw itself.
 * Always paints something immediately so the home screen never stays transparent.
 */
export async function widgetTaskHandler({
  widgetInfo,
  widgetAction,
  renderWidget,
}: WidgetTaskHandlerProps): Promise<void> {
  if (widgetAction === 'WIDGET_DELETED') return;

  const variant = WIDGET_VARIANTS[widgetInfo.widgetName] ?? 'medium';

  // Paint a known-good UI first. AsyncStorage / image resolve can lag in headless JS.
  try {
    renderWidget(<BobbleTasksWidget payload={null} variant={variant} />);
  } catch {
    renderWidget(<FallbackWidget />);
    return;
  }

  if (
    widgetAction !== 'WIDGET_ADDED' &&
    widgetAction !== 'WIDGET_UPDATE' &&
    widgetAction !== 'WIDGET_RESIZED'
  ) {
    return;
  }

  try {
    const payload = await loadTodayPayload();
    renderWidget(<BobbleTasksWidget payload={payload} variant={variant} />);
  } catch {
    // Keep the first paint; never leave a blank RemoteViews.
  }
}
