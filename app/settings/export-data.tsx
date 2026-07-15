import { FileSpreadsheet, FileText } from 'lucide-react-native';

import { SettingsLinkItemRow } from '@/src/components/settings/settings-item-row';
import {
  SettingsDescription,
  SettingsScreenLayout,
  SettingsSection,
} from '@/src/components/settings/settings-screen-layout';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';

export default function ExportDataScreen() {
  const colors = useBobbleColors();

  return (
    <SettingsScreenLayout title="Export Data">
      <SettingsDescription>
        Download your Bobbles, tasks, and profile data.
      </SettingsDescription>

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
