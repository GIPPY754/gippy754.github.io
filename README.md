# Hong Qiao — Academic Website

Personal website for Hong Qiao (乔宏), Assistant Professor, Peking University.
Built with React + TypeScript + Vite + Tailwind.

---

## Edit the text (the common case)

**All editable text lives in one file: [`src/content.ts`](src/content.ts).**

Open it in a text editor (VS Code recommended) and change the text inside the
quotes. It's organized by section: `hero`, `about`, `research`, `publications`,
`awards`, `experience`, `contact`.

- Plain fields — just edit between the quotes: `appointment: 'Assistant Professor, …'`
- Prose fields (`about.body`, `research.intro`, `publications.note`) accept
  **Markdown**: `**bold**`, `*italic*`, `[link text](https://…)`. A blank line
  starts a new paragraph.
- Lists (publications, awards, experience) are blocks between `[ ]`. Copy a
  whole `{ … }` block to add an entry; delete one to remove it.
- Keep the quotes, colons, and commas — those are what keep the file working.

Save the file and the browser tab updates automatically (while the dev server is
running). If the page goes blank after an edit, you probably dropped a quote or
comma — undo (Cmd-Z) and save again.

Layout and styling live in [`src/App.tsx`](src/App.tsx); you don't need to touch
it for normal text changes.

### Replacing the headshot photo

The headshot is `hong-headshot.jpg` in the project root (square, ~600×600).
Replace that file with a new square photo of the same name, or ask Claude Code to
crop a new one for you.

---

## Run it locally

**Prerequisites:** Node.js (v18 or newer).

```bash
npm install      # first time only — installs dependencies
npm run dev      # starts the dev server at http://localhost:3000
```

Then open http://localhost:3000 in your browser.

> **Note for this machine:** Node was installed as a standalone build at
> `~/.local/node` (Homebrew couldn't provide a prebuilt Node for this macOS
> version). If `npm` isn't found in a new terminal, prefix the path:
>
> ```bash
> export PATH="$HOME/.local/node/bin:$PATH"
> ```
>
> (Add that line to `~/.zshrc` to make it permanent.)

---

## Build for deployment

```bash
npm run build    # outputs a static site to dist/
npm run preview  # preview the production build locally
```

The `dist/` folder is a plain static site and can be hosted anywhere (GitHub
Pages, Netlify, Vercel, university web space, etc.).


