# Mermaid Chart Clone

A full-featured Mermaid diagram editor clone built with SvelteKit.

## Features

- 🎨 Real-time diagram editing and preview
- 📊 Support for multiple diagram types (Flowchart, Sequence, Class, State, ER, Gantt, etc.)
- 💾 Save and load diagrams
- 📤 Export to PNG, SVG, PDF
- 🔗 Share diagrams via links
- 👥 User authentication
- 📱 Responsive design

## Tech Stack

- **Framework**: SvelteKit
- **Diagram Engine**: Mermaid.js
- **Code Editor**: Monaco Editor
- **Backend**: Supabase
- **Styling**: TailwindCSS

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and configure your Supabase credentials:
```bash
cp .env.example .env
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── lib/
│   ├── components/     # Svelte components
│   ├── stores/         # Svelte stores
│   └── utils/          # Utility functions
├── routes/             # SvelteKit routes
└── app.html            # HTML template
```

## License

MIT
