import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@app/components/ui/card";

export default function OverlayPage() {

    return (
        <Card className="min-w-sm max-w-md">
            <CardHeader>
                <CardTitle>Page Settings</CardTitle>
                <CardDescription>
                    Configure your page settings here. You can adjust the layout, add widgets, and customize the appearance of your page.
                </CardDescription>
            </CardHeader>
            <CardContent>
            </CardContent>
        </Card>
    );
}