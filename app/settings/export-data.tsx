import { FileSpreadsheet, FileText } from 'lucide-react-native';
import { useState } from 'react';
import { Href, router } from 'expo-router';

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
import { useIsPro } from '@/src/hooks/use-subscription';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import { Text, View } from 'react-native';

export default function ExportDataScreen() {
  const colors = useBobbleColors();
  const isPro = useIsPro();
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
        Download your Bobbles, tasks, and profile data. PDF and CSV exports are included with Bobble
        Pro.
      </SettingsDescription>

      {!isPro ? (
        <View style={{ gap: 16, alignItems: 'center', paddingVertical: 24 }}>
          <Text style={{ color: colors.textSecondary, textAlign: 'center' }}>
            Upgrade to Bobble Pro to export your Bobbles as PDF or CSV.
          </Text>
          <PrimaryButton
            label="Unlock Bobble Pro"
            onPress={() => router.push('/paywall' as Href)}
            showChevron={false}
          />
        </View>
      ) : (
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
      )}
    </SettingsScreenLayout>
  );
}
