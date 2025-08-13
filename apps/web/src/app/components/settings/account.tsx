import {useAuth} from "@app/hooks/use-auth";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@app/components/ui/card";

export default function AccountSettings() {

    const {user} = useAuth();

    return (
        <div className={"p-6 space-y-6"}>
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
                <p className="text-muted-foreground">Manage your account settings and preferences.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Manage your account settings and preferences.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-4">

                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Roles and permissions</CardTitle>
                    <CardDescription>Manage your roles and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-4">

                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Authentification</CardTitle>
                    <CardDescription>Manage your sessions</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-4">
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>History</CardTitle>
                    <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-4">
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}