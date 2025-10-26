# Pass-Hints 1.0 (draft)

Purpose: permit explicit mapping of form fields by sites to help password managers.

Location:
- `/.well-known/pass.json` at site root (HTTPS only)
- Optional inline attributes: `data-pass="email|username|password|password-confirmation|otp|..."`
- Semantic version field: `semantics_version`

Example `/.well-known/pass.json`:
{
  "semantics_version":"1.0",
  "forms":[
    {
      "match": { "path": "/signup", "selector": "form#register" },
      "fields": {
        "username": ["#user","[name='user']"],
        "email": ["#email","input[type=email]"],
        "password": ["#pwd","input[name='password']"],
        "password_confirmation": ["#pwd2","input[name='confirm_password']"]
      }
    }
  ],
  "signing": { "algorithm":"ed25519", "pubkey":"<base64-or-url-to-key>" }
}

Guidelines:
- Sites should expose simple selectors; fallback heuristics remain mandatory.
- Sign file optionally to avoid tampering.
- Validator CLI must verify JSON schema and optional signature.

Data attributes (HTML):
<input data-pass="email" ...>
<input data-pass="password" ...>
<input data-pass="password-confirmation" ...>

Adoption:
- Provide npm packages / plugins for frameworks to auto-generate `pass.json`.
- Offer badge (Pass-Ready) when validator CI passes.
