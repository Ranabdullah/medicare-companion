# Medicare developer review kit

## Release status

REVIEW ONLY — planner, reminders and source-based AI checked; clinical review remains

Verified: Empty initial planner, optional fictional reminder, schedule/taken-log persistence, JSON and folder save/restore, encrypted cloud backup, invalid import preservation, local host protection and 390px layout. Reminder opt-in/test/disable requests deduplicate and skip taken doses. Notification bodies exclude medicine names. AI requires consent, enforces a daily request cap and retrieves actual reviewed NHS source context before an actual provider answer. This proves the connection, not medical accuracy.

Remaining: Clinical review of all health content, screening limitations, AI response quality, actual operating-system notification visibility, accessibility and real purchase verification remain. No warning does not mean a medicine combination is safe. This app does not diagnose, prescribe or guarantee alerts. The page/browser must remain open and the device awake for reminder checks.

## Start

Node.js 22+ is required. Extract into a permanent private folder and run npm ci. Use Start-Local.cmd or npm start, then open http://127.0.0.1:4177/ and keep the server and browser open while using reminders. The first-use guide explains local data and repeats from the information icon. Create reminders using your prescription/label and verify timing, dose and food directions with your pharmacist.

## Using the app

Use Reminders to Enable, Test or Disable browser notifications. They are optional and not a replacement for a reliable medicine alarm. Mark doses taken; due requests avoid duplicate/taken notifications. Use the health library to read source information. An AI question shows a consent prompt before sending the question and selected source text to your configured provider; your medicine schedule is not included. AI gives general source-based education and never changes the schedule.

## Data & backups

Working records stay in this browser/address. Enable folder backup from the information icon or save manually into Source/Local Data/backup.json; ten older saves are retained. Copy Local Data to another private drive. These local JSON files contain readable health information: protect them. A source ZIP is not a backup of browser records. Export before restoring or clearing browser storage.

## Own cloud

Optional encrypted backups use your own Cloudflare backup Worker described in Source/cloudflare. They are manual Save/Restore, not automatic collaboration. For optional health AI, deploy Source/cloudflare-ai with your own free Cloudflare account, set private BRIDGE_TOKEN, and set AI_BRIDGE_URL/AI_BRIDGE_TOKEN in Source/.env. HEALTH_AI_DAILY_LIMIT defaults to 20. The source and question go to the provider; planner records stay separate. Free quotas may stop AI; no automatic paid upgrade is configured. Leave fields blank to keep AI off.

## Purchase activation

Purchase activation is integrated in these three review kits. The seller service and signing database are prepared on free Cloudflare. Your real itch.io/Gumroad listings do not exist yet, so these copies keep ACTIVATION_REQUIRED=false and blank seller connection values. After creating listings, configure the exact shop product IDs, privately add the itch API key, set the seller URL/public verification key in the app server, and enable ACTIVATION_REQUIRED=true. Verify real purchase, wrong key, copied key, refund and renewal before uploading a customer release. The server assigns a signed installation code; certificates last 30 days and renew by verifying the receipt again. This is one logical server installation per purchase, not unbreakable DRM or a guarantee against copied editable source. Keep the signing private key only on the seller service. Ledger and Gods App were not changed. Link Launcher retains its existing seller-issued licence system; automatic shop activation was not added there.