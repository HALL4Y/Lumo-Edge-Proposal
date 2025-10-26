# SECURITY – Lumo-Edge (Résumé)

## Principes
- **Zero-Trust** : jamais de valeurs utilisateur en clair.
- Tout échange local est chiffré et signé.
- Consentement explicite requis avant tout envoi (Report-only).

## Primitives cryptographiques
- Key agreement: **X25519** (ECDH Curve25519).
- Symmetric AEAD: **AES-GCM** (256) ou **ChaCha20-Poly1305**.
- Signatures: **Ed25519**.
- KDF: **HKDF-SHA256** pour dériver clés de session.

## Stockage des clés
- **Clé privée longue durée** stockée dans Keychain / Secure Enclave (app).
- **Clé publique** distribuée aux extensions via le bundle ou mise à jour signée.
- Les clés de session sont éphémères et détruites à la fermeture.

## Canaux Apple-compatibles
- **iOS**: App Group file queue + blobs chiffrés.
- **macOS**: helper daemon + mTLS local.
- Pas de sockets serveurs persistants sur iOS.

## Protection contre abus
- Signatures Ed25519 sur chaque `.lumo` pour garantir origine et version.
- Filtrage et rate-limit côté endpoint `/v1/form-report`.
- Logging minimal et exportable par l’utilisateur. Pas de collecte de valeurs.

## Revue
- Tests cryptographiques automatisés (CI).
- Audit externe recommandé avant pilote.
