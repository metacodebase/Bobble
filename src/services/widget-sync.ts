'use no memo';

import { ExtensionStorage } from '@bacons/apple-targets';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { Platform } from 'react-native';
import { requestWidgetUpdate } from 'react-native-android-widget';

import type { Task } from '@/src/features/tasks/types';
import {
  buildWidgetPayload,
  IOS_APP_GROUP,
  WIDGET_PAYLOAD_KEY,
  type WidgetPayload,
} from '@/src/features/widget/widget-data';
import {
  BobbleTasksWidget,
  type BobbleWidgetVariant,
} from '@/src/widgets/bobble-tasks-widget';

/** Android widget names (from app.json plugin config) and their layout variants. */
const ANDROID_WIDGETS: { name: string; variant: BobbleWidgetVariant }[] = [
  { name: 'BobbleTasksSmall', variant: 'small' },
  { name: 'BobbleTasks', variant: 'medium' },
];

/**
 * Push a fresh snapshot of today's tasks to the home-screen widgets.
 * `todayTasks` must already be filtered to the local "today" set
 * (what filterTasksByParam(tasks, 'today') returns).
 *
 * Safe to call in builds that don't include the widget native modules yet —
 * both libraries no-op in that case.
 */
export async function syncTaskWidgets(todayTasks: Task[]): Promise<void> {
  await persistPayload(buildWidgetPayload(todayTasks));
}

/** Reset widgets to their signed-out/neutral state. */
export async function clearTaskWidgets(): Promise<void> {
  await persistPayload(null);
}

async function persistPayload(payload: WidgetPayload | null): Promise<void> {
  const json = payload ? JSON.stringify(payload) : null;

  try {
    if (json) {
      await AsyncStorage.setItem(WIDGET_PAYLOAD_KEY, json);
    } else {
      await AsyncStorage.removeItem(WIDGET_PAYLOAD_KEY);
    }
  } catch {
    // Widget data is best-effort; never break the calling flow.
  }

  if (Platform.OS === 'ios') {
    updateIosWidget(json);
  } else if (Platform.OS === 'android') {
    await updateAndroidWidget(payload);
  }
}

function updateIosWidget(json: string | null): void {
  try {
    const storage = new ExtensionStorage(IOS_APP_GROUP);
    if (json) {
      storage.set(WIDGET_PAYLOAD_KEY, json);
    } else {
      storage.remove(WIDGET_PAYLOAD_KEY);
    }
    ExtensionStorage.reloadWidget();
  } catch {
    // Native module not present in this build.
  }
}

async function updateAndroidWidget(payload: WidgetPayload | null): Promise<void> {
  for (const { name, variant } of ANDROID_WIDGETS) {
    try {
      await requestWidgetUpdate({
        widgetName: name,
        renderWidget: () => React.createElement(BobbleTasksWidget, { payload, variant }),
      });
    } catch {
      // Native module not present in this build.
    }
  }
}
