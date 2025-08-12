import { createFileRoute } from '@tanstack/react-router';
/*import appCss from "@styles/dashboard.css?url"
import '@styles/dashboard.css';*/

export const Route = createFileRoute('/editor')({
  head: () => ({
    meta: [
      {
        title: 'Editor',
      },
    ],
    links: [
      /*{
        rel: "stylesheet",
        href: appCss,
      },*/
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/editor"!</div>;
}
