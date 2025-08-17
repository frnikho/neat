import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@app/components/ui/card";
import {useQuery} from "@tanstack/react-query";
import {api, apiClient} from "@app/lib/client";
import {match, P} from "ts-pattern";
import {Spinner} from "@app/components/ui/shadcn-io/spinner";

export default function OverlayPage() {

    const {data, error, isPending} = useQuery({queryKey: ['pages'], queryFn: () => api(apiClient.page.get, {query: {page: 0}})});

    const component = match({data, isPending, error})
        .with({isPending: true} ,() => <Spinner variant={'default'}/>)
        .with({error: P.nonNullable}, ({error}) => {
            console.error('Error fetching pages:', error);
            return <div>Error loading pages</div>;
        })
        .otherwise((value) => {
            console.log(value);
            return <div>abc</div>
        });

    return (
        <Card className="min-w-sm max-w-md">
            <CardHeader>
                <CardTitle>Page Settings</CardTitle>
                <CardDescription>
                    Configure your page settings here. You can adjust the layout, add widgets, and customize the appearance of your page.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {component}
            </CardContent>
        </Card>
    );
}