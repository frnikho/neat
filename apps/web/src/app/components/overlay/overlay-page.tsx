import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@app/components/ui/card";
import {useQuery} from "@tanstack/react-query";
import {api, apiClient} from "@app/lib/client";
import {match, P} from "ts-pattern";
import {Spinner} from "@app/components/ui/shadcn-io/spinner";

export default function OverlayPage() {

    const {data, error, isPending} = useQuery({queryKey: ['pages'], queryFn: () => api(apiClient.page.get, {query: {page: 0}})});

    const PageComponent = (page: {name: string, id: string, slug: string}) => {
        return (
            <Card className="mb-4">
                <CardContent>
                    <CardTitle>{page.name} <span className={'text-xs text-gray-500'}>({page.slug})</span></CardTitle>
                </CardContent>
            </Card>
        );
    }

    const ErrorComponent = () => {
        return (<Card>
            <h2>Error</h2>
            <p>There was an error loading the page settings. Please try again later.</p>
        </Card>)
    }

    const component = match({data, isPending, error})
        .with({isPending: true} ,() => <Spinner variant={'default'}/>)
        .with({error: P.nonNullable}, ({error}) => {
            console.error('Error fetching pages:', error);
            return <ErrorComponent/>
        })
        .with({data: P.nonNullable}, ({data}) => {
            return data.match((t) => {
                if (t.data) {
                    return t.data.pages.map((p) => <PageComponent key={p.id} {...p}/>)
                }
                return (<ErrorComponent/>)
            }, () => <ErrorComponent/>)
        })
        .otherwise(({data}) => <ErrorComponent/>);

    return (
        <>
            <Card className="min-w-sm max-w-md">
                <CardHeader>
                    <CardTitle>Page Settings</CardTitle>
                    <CardDescription>
                        Configure your page settings here. You can adjust the layout, add widgets, and customize the appearance of your page.
                    </CardDescription>
                </CardHeader>
                <CardContent className={'overflow-auto'}>
                    {component}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Page Settings</CardTitle>
                    <CardDescription>
                        This is a placeholder for page settings. You can add more components or settings here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Add more settings or components here */}
                </CardContent>
            </Card>
        </>
    );
}