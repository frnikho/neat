import {ComponentProps} from "react";
import Widget from "@app/components/widgets/widget";

type Props = {
    text: string;
    className?: string;
}

export default function TextWidget({}: ComponentProps<"text"> & Props) {
    return (
        <Widget<string> children={(data) => {
            return (
                <div>

                </div>
            )
        }}/>
    )
}