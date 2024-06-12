export { default } from "./page";
// this page will never be rendered unless the /create-post page was reloaded or was initial loaded
// export {default} from ... means that this fallback page will export the default exported function in page.tsx (the home page)
// so when initial load or reload page this will render (the home page) + the modal