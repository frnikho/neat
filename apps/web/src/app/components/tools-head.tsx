import {Separator} from "@app/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@app/components/ui/breadcrumb";
import {SidebarTrigger} from "@app/components/ui/sidebar";
import { match } from "ts-pattern";
import {useNavigate, useRouter} from "@tanstack/react-router";

type Item = {
    title: string;
    url: string;
}

type Props = {
    items: Item[];
}

export default ({items}: Props) => {

    const router = useNavigate();

    return (
        <header className="flex shrink-0 items-center gap-2">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4"/>
                <Breadcrumb>
                    <BreadcrumbList>

                        {items.map((item, index) => (
                            <BreadcrumbItem key={item.title}>
                                {match(index === 0)
                                        .with(true, () => null)
                                        .with(false, () => <BreadcrumbSeparator/>)
                                        .exhaustive()}
                                {match(items.length - 1 === index)
                                    .with(false, () => <BreadcrumbLink className={"cursor-pointer"} onClick={() => router({to: item.url})}>{item.title}</BreadcrumbLink>)
                                    .with(true, () => <BreadcrumbPage>{item.title}</BreadcrumbPage>)
                                    .exhaustive()}
                            </BreadcrumbItem>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </header>
    )
}