import {ComponentProps, ReactNode} from "react";

export default function Widget<T>(props: {children: (data: T) => ReactNode}) {
    return (
        <div className={'cursor-pointer'}>
            {props.children('' as T)}
        </div>
    )
}