# Lumo-Edge-proposal

## 🎯 Objectif
Développer **Lumo-Edge**, un **agent local opt-in** conçu pour **Proton Pass**, capable d’analyser les formulaires web et d’améliorer l’autoremplissage **sans jamais exposer de données sensibles**.

Deux modes :
- **Report-only** → envoie uniquement le schéma du formulaire (signé localement, zéro clair).  
- **Autopilot local** → exécute l’analyse et le remplissage entièrement en local.

---

## 🧩 Architecture générale
- **Extension MV3 / Safari Web Extension** injectant un worker `lumo-edge`.  
- **API locale** exposée par le worker :

| Méthode | Endpoint | Fonction |
|----------|-----------|-----------|
| `POST` | `/analyze` | Extraction du schéma DOM |
| `POST` | `/redact`  | Floutage local des champs sensibles |
| `POST` | `/sign`    | Signature Ed25519 du payload |
| `POST` | `/report`  | Transmission chiffrée (mode Report-only) |

Stockage : cache chiffré par domaine, versionné, effacement automatique.

---

## 🔒 Canaux chiffrés Apple-compatibles

### iOS – App Group + fichiers chiffrés
1. L’extension chiffre le schéma via **clé publique** de l’app Proton Pass (X25519 → AES-GCM).  
2. Le blob chiffré est écrit dans le dossier **App Group** (`group.ch.proton.lumo`).  
3. L’app lit, déchiffre (clé privée dans Secure Enclave) et répond dans le même dossier.  
4. Aucune donnée ne transite hors de l’appareil ; Apple ne voit qu’un flux binaire opaque.  

### macOS – Daemon local mTLS
- L’app lance un helper sandboxé communiquant en **mTLS** sur `127.0.0.1`.  
- L’extension échange des blobs chiffrés avec ce daemon.  
- Flux E2E illisible : l’OS peut observer le trafic, pas le contenu.

**Avantage :** architecture conforme aux règles Apple, sans clair ni sockets réseau externes.

---

## 🔐 Sécurité
- Modèle **Zero-Trust** : aucune donnée utilisateur collectée.  
- Chiffrement : X25519 + AES-GCM ou ChaCha20-Poly1305.  
- Signatures Ed25519 sur tous les rapports.  
- Clés stockées dans **Secure Enclave / Keychain**.  
- Permissions minimales : `activeTab`, `scripting`, `storage`.  
- Auditabilité : export local du journal de consentement.

---

## 🧠 Moteur de mapping
- Analyse **sémantique** : `data-pass`, `name`, `aria-label`.  
- Analyse **structurelle** : `<label for>` + proximité visuelle.  
- Reconnaissance automatique des paires `password / confirmation`.  
- Gestion latence + shadow DOM + iframes.

---

## 🌐 Standard complémentaire : *Pass-Hints 1.0*
- Fichier `/.well-known/pass.json` et attributs `data-pass-*`.  
- Validator CLI + badge **Pass-Ready**.  
- Objectif : compatibilité inter-navigateurs et fiabilité > 95 %.

---

## 🚀 Roadmap initiale
| Étape | Délai | Livrable |
|-------|--------|-----------|
| PoC DOM analysis | 2 sem. | Extension MV3 minimale |
| Redaction + signatures | 2 sem. | Module `redact.js` |
| Endpoint `/v1/form-report` | 2 sem. | Sandbox serveur Proton |
| Pilote 20 domaines | 2 sem. | Tableau de bord interne |

---

## 📊 Indicateurs
| KPI | Cible |
|-----|-------|
| Taux d’autofill réussi | ≥ 85 % |
| Délai signal → patch | ≤ 7 jours |
| Tickets support autofill | − 30 % |
| Consentement opt-in | ≥ 70 % |

---

## 📁 Exemple de payload
```json
{
  "page": { "url": "https://example.com/signup", "ua": "Safari/18" },
  "forms": [
    {
      "selector": "form#register",
      "inputs": [
        { "type": "email", "id": "email", "label": "E-mail" },
        { "type": "password", "id": "pwd", "label": "Mot de passe" },
        { "type": "password", "id": "pwd2", "label": "Confirmation" }
      ]
    }
  ],
  "policy": { "consent": true, "scopes": ["structure"] },
  "sig": "ed25519:BASE64",
  "ver": "Lumo-Edge-0.1"
}
