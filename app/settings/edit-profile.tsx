import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { LabeledTextInput } from '@/src/components/create-account/labeled-text-input';
import { PhoneInput } from '@/src/components/create-account/phone-input';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import {
  SettingsDescription,
  SettingsScreenLayout,
} from '@/src/components/settings/settings-screen-layout';
import { PROFILE_USER } from '@/src/data/demo-data';
import type { Country } from '@/src/data/countries';
import { useMe } from '@/src/hooks/api';
import { useProfile, useUpdateProfile } from '@/src/hooks/profile';
import { useAppStore } from '@/src/store/app-store';
import { formatStoredPhone, parseStoredPhone } from '@/src/utils/phone';
import { toast } from '@/src/utils/toast';

export default function EditProfileScreen() {
  const storedUser = useAppStore((s) => s.user);
  const { data: fetchedUser } = useMe();
  const { data: profile } = useProfile();
  const user = fetchedUser ?? storedUser;

  const initialName = user?.name ?? profile?.user.name ?? PROFILE_USER.name;
  const initialPhone = user?.phone ?? profile?.user.phone ?? PROFILE_USER.phone;
  const initialAddress = user?.address ?? profile?.user.address ?? PROFILE_USER.address;
  const parsedPhone = parseStoredPhone(initialPhone);

  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(parsedPhone.localNumber);
  const [country, setCountry] = useState<Country>(parsedPhone.country);
  const [address, setAddress] = useState(initialAddress);
  const updateProfile = useUpdateProfile();

  const handleSave = () => {
    const trimmedName = name.trim();
    const trimmedAddress = address.trim();
    const formattedPhone = formatStoredPhone(country, phone);

    if (!trimmedName) {
      toast.error('Name is required');
      return;
    }

    const updates: {
      name?: string;
      phone?: string;
      address?: string;
    } = {};

    if (trimmedName !== initialName.trim()) {
      updates.name = trimmedName;
    }
    if (formattedPhone !== initialPhone.trim()) {
      updates.phone = formattedPhone;
    }
    if (trimmedAddress !== initialAddress.trim()) {
      updates.address = trimmedAddress;
    }

    if (Object.keys(updates).length === 0) {
      router.back();
      return;
    }

    updateProfile.mutate(updates, {
      onSuccess: () => router.back(),
    });
  };

  return (
    <SettingsScreenLayout title="Edit Profile">
      <SettingsDescription>
        Update the details shown on your profile.
      </SettingsDescription>

      <View style={styles.form}>
        <LabeledTextInput
          label="Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType="next"
          maxLength={120}
        />

        <PhoneInput
          value={phone}
          onChangeText={setPhone}
          country={country}
          onChangeCountry={setCountry}
        />

        <LabeledTextInput
          label="Address"
          value={address}
          onChangeText={setAddress}
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={handleSave}
          maxLength={240}
          multiline
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
