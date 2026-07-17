import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { LabeledTextInput } from '@/src/components/create-account/labeled-text-input';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import {
  SettingsDescription,
  SettingsScreenLayout,
} from '@/src/components/settings/settings-screen-layout';
import { useChangePassword } from '@/src/hooks/api';
import { toast } from '@/src/utils/toast';

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const changePassword = useChangePassword();

  const handleSave = () => {
    if (!currentPassword) {
      toast.error('Enter your current password');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (currentPassword === newPassword) {
      toast.error('New password must be different from your current password');
      return;
    }

    changePassword.mutate({ currentPassword, newPassword });
  };

  return (
    <SettingsScreenLayout title="Change Password">
      <SettingsDescription>
        Choose a new password for your account. Use at least 8 characters.
      </SettingsDescription>

      <View style={styles.form}>
        <LabeledTextInput
          label="Current password"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="password"
          autoComplete="password"
        />
        <LabeledTextInput
          label="New password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="newPassword"
          autoComplete="password-new"
        />
        <LabeledTextInput
          label="Confirm new password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="newPassword"
          autoComplete="password-new"
          returnKeyType="done"
          onSubmitEditing={handleSave}
        />

        <PrimaryButton
          label="Update password"
          showChevron={false}
          loading={changePassword.isPending}
          disabled={changePassword.isPending}
          onPress={handleSave}
        />
      </View>
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 20,
  },
});
