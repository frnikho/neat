import ToolsHead from '@app/components/tools-head';
import { Button } from '@app/components/ui/button';
import { apiClient } from '@app/lib/client';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/dashboard/settings/')({
  component: RouteComponent,
});

function RouteComponent() {
  useEffect(() => {
    apiClient.auth.me
      .get()
      .then((d) => {
        console.log('User data fetched successfully', d);
      })
      .catch((err) => {
        console.error('Error fetching user data', err);
      });
  });

  return (
    <>
      <ToolsHead items={[{ title: 'Settings', url: '/dashboard/settings' }]} />
      <Button onClick={() => console.log('abc')}>Hello World</Button>
    </>
  );
}
