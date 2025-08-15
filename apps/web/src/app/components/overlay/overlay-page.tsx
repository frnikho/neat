import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@app/components/ui/card";

export default function OverlayPage() {

    return (
        <Card className="min-w-xs max-w-md">
            <CardHeader>
                <CardTitle>Page Settings</CardTitle>
                <CardDescription>
                    Configure your page settings here. You can adjust the layout, add widgets, and customize the appearance of your page.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-gray-500">
                    This is where you can manage your page settings. Use the options available to modify the layout and add widgets as needed.
                </div>
            </CardContent>
        </Card>
    );
}