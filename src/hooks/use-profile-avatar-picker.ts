import * as ImagePicker from 'expo-image-picker';
import { readAsStringAsync, EncodingType } from 'expo-file-system/legacy';
import { Camera, ImageIcon } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';

import type { ActionSheetOption } from '@/src/components/ui/action-sheet';
import { useUploadAvatar } from '@/src/hooks/profile';
import { toast } from '@/src/utils/toast';

const PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.55,
  base64: true,
};

async function pickImage(
  source: 'library' | 'camera',
): Promise<{ base64: string; mimeType: string } | null> {
  const permission =
    source === 'camera'
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    toast.error(
      source === 'camera'
        ? 'Camera access is required to take a profile photo.'
        : 'Photo library access is required to choose a profile photo.',
    );
    return null;
  }

  const result =
    source === 'camera'
      ? await ImagePicker.launchCameraAsync(PICKER_OPTIONS)
      : await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS);

  if (result.canceled || !result.assets[0]?.uri) {
    return null;
  }

  const asset = result.assets[0];
  const base64 = asset.base64 ?? (await readAsStringAsync(asset.uri, { encoding: EncodingType.Base64 }));
  if (!base64) {
    toast.error('Could not read the selected photo.');
    return null;
  }

  return {
    base64,
    mimeType: asset.mimeType ?? 'image/jpeg',
  };
}

export function useProfileAvatarPicker() {
  const [visible, setVisible] = useState(false);
  const uploadAvatar = useUploadAvatar();

  const closePicker = useCallback(() => setVisible(false), []);

  const openPicker = useCallback(() => {
    if (uploadAvatar.isPending) return;
    setVisible(true);
  }, [uploadAvatar.isPending]);

  const uploadFromSource = useCallback(
    async (source: 'library' | 'camera') => {
      if (uploadAvatar.isPending) return;

      try {
        const payload = await pickImage(source);
        if (!payload) return;
        uploadAvatar.mutate({
          imageBase64: payload.base64,
          mimeType: payload.mimeType,
        });
      } catch (error) {
        console.warn('[profile] avatar pick failed', error);
        toast.error('Could not update your profile photo.');
      }
    },
    [uploadAvatar],
  );

  const options = useMemo<ActionSheetOption[]>(
    () => [
      {
        id: 'library',
        label: 'Choose from library',
        icon: ImageIcon,
        onPress: () => void uploadFromSource('library'),
      },
      {
        id: 'camera',
        label: 'Take photo',
        icon: Camera,
        onPress: () => void uploadFromSource('camera'),
      },
    ],
    [uploadFromSource],
  );

  return {
    openPicker,
    closePicker,
    isUploading: uploadAvatar.isPending,
    sheetProps: {
      visible,
      title: 'Profile photo',
      subtitle: 'Update how you appear on Bobble',
      options,
      onClose: closePicker,
    },
  };
}
