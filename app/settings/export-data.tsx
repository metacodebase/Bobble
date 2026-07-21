import { FileSpreadsheet, FileText } from 'lucide-react-native';
import { useState } from 'react';

import { SettingsLinkItemRow } from '@/src/components/settings/settings-item-row';
import {
  SettingsDescription,
  SettingsScreenLayout,
  SettingsSection,
} from '@/src/components/settings/settings-screen-layout';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { exportUserDataCsv } from '@/src/utils/export-user-data';
import { toast } from '@/src/utils/toast';

export default function ExportDataScreen() {
  const colors = useBobbleColors();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCsv = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      await exportUserDataCsv();
      toast.success('Export ready to share');
    } catch (error) {
      if (error instanceof Error && /cancel|dismiss|did not share|user denied/i.test(error.message)) {
        return;
      }
      toast.error('Could not export data');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <SettingsScreenLayout title="Export Data">
      <SettingsDescription>
        Download your Bobbles, tasks, and profile data.
      </SettingsDescription>

      <SettingsSection>
        <SettingsLinkItemRow
          label="Export as PDF"
          icon={<FileText size={22} color={colors.primary} strokeWidth={2} />}
          onPress={() => toast.success('PDF export is coming soon')}
        />
        <SettingsLinkItemRow
          label={isExporting ? 'Preparing CSV…' : 'Export as CSV'}
          icon={<FileSpreadsheet size={22} color={colors.primary} strokeWidth={2} />}
          onPress={isExporting ? undefined : () => void handleExportCsv()}
          isLast
        />
      </SettingsSection>
    </SettingsScreenLayout>
  );
}
