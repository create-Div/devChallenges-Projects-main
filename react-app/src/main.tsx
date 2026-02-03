import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

const rootEl = document.querySelector("#root");

if (rootEl) {
	const root = createRoot(rootEl);
	root.render(
		<StrictMode>
			<App />
		</StrictMode>,
	);
}
