# React + Vite

## Getting Started

Install dependencies:

```bash
npm install
```

Start the local dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Testing

Tests run on [Vitest](https://vitest.dev). Test files are colocated with the code they test (`formatTime.js` → `formatTime.test.js` in the same folder) and picked up automatically — no registration needed.

Run in watch mode (reruns automatically as you edit, use this while writing tests):

```bash
npm test
```

Run once and exit (for a one-off check, e.g. before committing):

```bash
npx vitest run
```

## Linting

```bash
npm run lint
```

Also runs live in-editor if the [ESLint VS Code extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) is installed — catches things like undefined-variable references before you even save.


This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
