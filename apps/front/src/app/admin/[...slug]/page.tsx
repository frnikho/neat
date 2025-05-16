import {getMenuPage} from "@/lib/module";

type Props = {
    params: Promise<{ slug: string[] }>
}

export default async function Page({params}: Props) {

    const slugs = (await params).slug;

    const result = getMenuPage(slugs[0], slugs[1]);

    if (result === null) {
        return (
            <div>
                Page not found
            </div>
        )
    }

    return result();
}