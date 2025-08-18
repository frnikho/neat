import {useAuth} from "@app/hooks/use-auth";
import {Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle} from "@app/components/ui/card";
import {Button} from "@app/components/ui/button";
import {Eye} from "lucide-react";
import {useNavigate} from "@tanstack/react-router";

export default function AccountSettings() {

    const {user, roles} = useAuth();
    const navigate = useNavigate();

    return (
        <div className={"p-6 space-y-6"}>
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Mon compte</h1>
                <p className="text-muted-foreground">Gérer vos paramètres et vos préférences</p>
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
                <CardContent className={'grid grid-cols-1 lg:grid-cols-2 gap-8'}>
                    {roles.map(({role, permissions}) => (

                        <Card key={role.id}>
                            <CardHeader>
                                <CardTitle>{role.name}</CardTitle>
                                <CardDescription>{role.description}</CardDescription>
                                <CardAction>
                                    <Button variant={'link'} size={'icon'} onClick={() => navigate({to: '/dashboard/settings/role', search: {id: role.id}})}><Eye/></Button>
                            </CardAction>
                            </CardHeader>
                        </Card>

                    ))}
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