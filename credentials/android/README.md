# Android Play upload keystore

Files here are **not** committed (see root `.gitignore`).

| File | Purpose |
| --- | --- |
| `bobble-upload.keystore` | Upload key used to sign AABs for Play Console |
| `keystore.properties` | Passwords + alias for local `npm run android:aab` |

## Backup

Store both files in a password manager or encrypted drive. If you lose the upload key and did not enroll in Play App Signing with a recoverable upload key, you cannot ship updates under the same Play listing.

## Generate / rebuild AAB

```bash
npm run android:aab
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

## Fingerprints

```bash
keytool -list -v \
  -keystore credentials/android/bobble-upload.keystore \
  -alias bobble-upload
```

Add SHA-1 / SHA-256 to Firebase (`com.bobble.au`) and, after the first Play upload, also add Play’s **App signing key** certificate hashes from Play Console → App integrity.
