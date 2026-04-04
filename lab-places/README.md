# places.minilab.work

Product surface for the `minilab.work` ecosystem.

This app is the operational places UI: cockpit, inspectors, timelines, log views, terminal sessions, and agent surfaces.

## Run

```bash
doppler run -- npm run dev
```

Open `http://localhost:3000`.

## Role In The Namespace

- `places.minilab.work`: product UI and operator surface
- `core.minilab.work`: Rust control plane and node services
- `library.minilab.work`: central home for official docs
- `bringup.minilab.work`: bootstrap, bring-up, installation, verification, and active bootstrap contracts
