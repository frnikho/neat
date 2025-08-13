import {createRootRoute, HeadContent, Outlet} from "@tanstack/react-router";

export const Route = createRootRoute({
	component: () => (
		<html>
			<head>
				<HeadContent />
			</head>
			<body>
				<Outlet />
			</body>
		</html>
	),

	notFoundComponent: () => (
		<div>
			<h1>404 - Not Found</h1>
			<p>The page you are looking for does not exist.</p>
		</div>
	),
});
