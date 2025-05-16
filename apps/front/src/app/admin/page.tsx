import {modules} from "$app";

export default async function Page() {

  return (
    <div>
      <h1>Backoffice</h1>
        <p>Welcome to the Backoffice page!</p>
        {modules.map((m) => m.servers.map((c) => c({})))}
    </div>
  );
}