import { FileSpreadsheet, FileText } from 'lucide-react-native';
import { StyleSheet, Text } from 'react-native';

import { SettingsLinkItemRow } from '@/src/components/settings/settings-item-row';
import {
  SettingsScreenLayout,
  SettingsSection,
} from '@/src/components/settings/settings-screen-layout';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

export default function ExportDataScreen() {
  const colors = useBobbleColors();

  return (
    <SettingsScreenLayout title="Export Data">
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        Download your Bobbles, tasks, and profile data.
      </Text>

      <SettingsSection>
        <SettingsLinkItemRow
          label="Export as PDF"
          icon={<FileText size={22} color={colors.primary} strokeWidth={2} />}
          onPress={() => {}}
        />
        <SettingsLinkItemRow
          label="Export as CSV"
          icon={<FileSpreadsheet size={22} color={colors.primary} strokeWidth={2} />}
          onPress={() => {}}
          isLast
        />
      </SettingsSection>
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  description: {
    ...Typography.body,
    lineHeight: 22,
  },
});
