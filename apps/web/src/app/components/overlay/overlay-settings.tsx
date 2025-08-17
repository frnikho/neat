import {LayoutDashboard, Paintbrush} from "lucide-react";
import {Button} from "@app/components/ui/button";

export default function OverlaySettings() {
    return (
        <div className={'flex flex-row gap-2 w-full h-full'}>
            <Button size={'icon'} variant={'outline'}><Paintbrush/></Button>
            <Button size={'icon'} variant={'outline'}><LayoutDashboard/></Button>
        </div>
    )
}