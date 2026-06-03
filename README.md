## Utils Command

- ```npm install``` -> install the module need for the project
- ```npm update``` -> update all module
- ```npm audit``` -> check if module is outdated

### Dev
- ```npm run dev``` (web)

### Production
- ```npm run build``` (web)



# Server

To do :
- Bug joueur pas deco quand retour ? (plusieurs f5 pour corriger sa) (a revoir)
- Systeme de ligne qui se retire (animation) et qui se bloque pour les autres joueurs
- Systeme de fin de game et detection si tout les joueurs ont fini
- Adapter game en multi pour le solo
- Piece invisible option
- Limite de temps option
- Recheck sujet et correction



# Client (React + Vite)

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
