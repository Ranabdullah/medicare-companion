# MediCare AI Companion

MediCare provides a medication schedule, reminder controls and a dated activity log.

[Try the browser demo](https://medicare-planner-demo.ranakaharian1.workers.dev/) · [See the portfolio](https://ranova.vercel.app/technical-projects)

## Features

The public demo includes **Daily Schedule**, **Reminders** and **Activity**. It contains one fictional reminder. You can change its time, mark it taken or pending and inspect the dated activity. These changes save in the same browser.

The full source includes manual medication and schedule entry, health-topic browsing, optional browser notifications, printing, JSON backup and restore, and optional source-based AI education through your own provider. Notifications require permission and the app to remain open with the device awake.

## Try the demo

1. Open **Daily Schedule** and find the example reminder.
2. Select **Reminders**, choose another time and select **Save time**.
3. Return to **Daily Schedule**. Mark the example taken.
4. Open **Activity** to see the date, time and recorded state.
5. Use **Reset example activity** to clear the sample activity.
6. Use **Print / Export** to open the browser’s print dialog.

The public demo uses fictional reminders. Its AI and personal medication-entry panels are disabled.

## Install a private workspace

Use Node.js 22 or newer.

1. Download and extract this repository.
2. In the extracted folder run the commands below.

```powershell
npm ci
npm start
```

Open **http://127.0.0.1:4177/**. You can also use `Start-Local.cmd` on Windows after installing the dependencies.

The private workspace starts empty. Enter the schedule supplied by your prescriber or medicine label, save it, and use the schedule to record taken doses. Enable notifications only when you want them and send a test notification. Use the backup controls to export your records and keep copies outside browser storage.

Optional AI and cloud backup use the configuration in `.env.example` and the setup notes in [README-FIRST.md](README-FIRST.md). Local reminder data belongs to the browser/address where it was entered.

## Verification and clinical limits

The supplied `medicare-companion-main.zip` matches this release after normalising line endings. Browser checks exercised the fictional schedule, time changes, activity, reload persistence and phone layout. Clinical review, real-world notification reliability and educational AI quality remain separate checks. Use the app to record a schedule and consult a clinician or pharmacist for medication decisions.

## Languages and tools

HTML, CSS, JavaScript and Node.js. Optional services use Cloudflare Workers and a configured AI provider. The public demo is in `demo/`.
