import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";
import Footer from "../assets/Footer";
import Header from "../assets/Header";

export const Route = createRootRoute({
	component: () => (
		<>
			<HeadContent />
			<Header />
			<Outlet />
			<Footer />
		</>
	),
});
