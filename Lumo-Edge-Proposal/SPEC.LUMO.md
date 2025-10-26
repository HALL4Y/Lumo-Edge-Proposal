# SPEC: .lumo envelope (format JSON, base64 fields)

Purpose: standard d'enveloppe pour échanges chiffrés entre Extension ↔ App.

Top-level JSON:
{
  "ver": "1.0",
  "ts": "ISO8601 timestamp",
  "domain": "example.com",
  "domain_hash": "sha256 hex of domain||ver",
  "ephemeral_pub": "<base64>",   // ephemeral X25519 public key (if using ephemeral)
  "nonce": "<base64>",           // nonce used for AEAD
  "cipher": "<base64>",          // AEAD ciphertext (binary -> base64)
  "sig": "<base64>",             // Ed25519 signature over header+cipher
  "meta": { "agent":"lumo-edge", "platform":"ios|macos|chrome" }
}

Notes:
- cipher = AEAD.encrypt(plaintext, key=sessionKey, nonce)
- sessionKey derived via X25519(sharedSecret) -> HKDF -> symmetric key
- signature covers concatenation: ver||ts||domain_hash||ephemeral_pub||nonce||cipher
- plaintext payload: JSON with schema: { page:{url,title}, forms:[...], policy:{consent:true,...} }
- All base64 must use URL-safe without padding or standard base64 consistent across impl.
- File extension: `.lumo`. File name pattern: `in-<ts>-<shortid>.lumo`

Security:
- When using "seal" (libsodium crypto_box_seal) ephemeral_pub may be omitted (sealed box contains ephemeral).
- Implement robust replay protection: include ts & domain_hash; reject if outside allowed window.
