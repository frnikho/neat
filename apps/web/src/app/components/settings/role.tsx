import {useQuery} from "@tanstack/react-query";
import {apiClient} from "@app/lib/client";

type Props = {
    page: number | undefined;
    limit: number | undefined;
}

export default function Role({limit, page}: Props) {

    const {data, isPending, error} = useQuery({queryKey: ['roles'], queryFn: () => apiClient.role.get({query: {page, limit}})});

    console.log(data);

    return (
        <div>
            <p>Hello</p>
        </div>
    )
}