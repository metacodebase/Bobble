import { FileSpreadsheet, FileText } from 'lucide-react-native';
import { useState } from 'react';

import { SettingsLinkItemRow } from '@/src/components/settings/settings-item-row';
import {
  SettingsDescription,
  SettingsScreenLayout,
  SettingsSection,
} from '@/src/components/settings/settings-screen-layout';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import {
  exportUserDataCsv,
  exportUserDataPdf,
  getExportErrorMessage,
  isExportShareCancelled,
} from '@/src/utils/export-user-data';
import { toast } from '@/src/utils/toast';

export default function ExportDataScreen() {
  const colors = useBobbleColors();
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingCsv, setIsExportingCsv] = useState(false);

  const handleExportPdf = async () => {
    if (isExportingPdf || isExportingCsv) return;
    setIsExportingPdf(true);
    try {
      await exportUserDataPdf();
      toast.success('PDF export ready to share');
    } catch (error) {
      if (isExportShareCancelled(error)) return;
      toast.error(getExportErrorMessage(error, 'Could not export PDF'));
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleExportCsv = async () => {
    if (isExportingPdf || isExportingCsv) return;
    setIsExportingCsv(true);
    try {
      await exportUserDataCsv();
      toast.success('CSV export ready to share');
    } catch (error) {
      if (isExportShareCancelled(error)) return;
      toast.error('Could not export CSV');
    } finally {
      setIsExportingCsv(false);
    }
  };

  return (
    <SettingsScreenLayout title="Export Data">
      <SettingsDescription>
        Download your Bobbles, tasks, and profile data.
      </SettingsDescription>

      <SettingsSection>
        <SettingsLinkItemRow
          label={isExportingPdf ? 'Preparing PDF…' : 'Export as PDF'}
          icon={<FileText size={22} color={colors.primary} strokeWidth={2} />}
          onPress={isExportingPdf ? undefined : () => void handleExportPdf()}
        />
        <SettingsLinkItemRow
          label={isExportingCsv ? 'Preparing CSV…' : 'Export as CSV'}
          icon={<FileSpreadsheet size={22} color={colors.primary} strokeWidth={2} />}
          onPress={isExportingCsv ? undefined : () => void handleExportCsv()}
          isLast
        />
      </SettingsSection>
    </SettingsScreenLayout>
  );
}
