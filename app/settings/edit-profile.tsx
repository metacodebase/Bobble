import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { LabeledTextInput } from '@/src/components/create-account/labeled-text-input';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import {
  SettingsDescription,
  SettingsScreenLayout,
} from '@/src/components/settings/settings-screen-layout';
import { PROFILE_USER } from '@/src/data/demo-data';
import { useMe } from '@/src/hooks/api';
import { useUpdateProfile } from '@/src/hooks/profile';
import { useAppStore } from '@/src/store/app-store';
import { toast } from '@/src/utils/toast';

export default function EditProfileScreen() {
  const storedUser = useAppStore((s) => s.user);
  const { data: fetchedUser } = useMe();
  const user = fetchedUser ?? storedUser;
  const initialName = user?.name ?? PROFILE_USER.name;

  const [name, setName] = useState(initialName);
  const updateProfile = useUpdateProfile();

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error('Name is required');
      return;
    }
    if (trimmed === initialName.trim()) {
      router.back();
      return;
    }

    updateProfile.mutate(
      { name: trimmed },
      {
        onSuccess: () => router.back(),
      }
    );
  };

  return (
    <SettingsScreenLayout title="Edit Profile">
      <SettingsDescription>Update the name shown on your profile.</SettingsDescription>

      <View style={styles.form}>
        <LabeledTextInput
          label="Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={handleSave}
          maxLength={120}
        />

        <PrimaryButton
          label="Save"
          showChevron={false}
          loading={updateProfile.isPending}
          disabled={updateProfile.isPending}
          onPress={handleSave}
        />
      </View>
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 24,
  },
});
