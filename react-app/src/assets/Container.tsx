import type { ReactNode } from "react";

export default function Container({
	children,
	wide,
}: {
	children: ReactNode;
	wide?: boolean;
}) {
	return (
		<div className={`container py-md-5 ${wide ? "" : "container--narrow"}`}>
			{children}
		</div>
	);
}
