import { createFileRoute, HeadContent, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_public')({
  head: () => ({
    meta: [],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <HeadContent />
      <Outlet />
    </>
  );
}
