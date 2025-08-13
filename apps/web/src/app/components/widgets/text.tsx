import {ComponentProps} from "react";

type Props = {
    text: string;
    className?: string;
}

export default function TextWidget({}: ComponentProps<"text"> & Props) {



    return (<p>

    </p>)
}