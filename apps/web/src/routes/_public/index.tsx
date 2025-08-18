import {createFileRoute, useNavigate} from "@tanstack/react-router";
import {TextWidget} from "@app/components/widgets/text/text.widget";
import CardWidget from "@app/components/widgets/card/card.widget";

export const Route = createFileRoute("/_public/")({
	component: RouteComponent,
});

function RouteComponent() {

    const navigate = useNavigate();

	return (
        <div className={'flex flex-col gap-4'}>
            <TextWidget wkey={'main_title'} defaultData={{fr: 'Titre par défault', en: 'Default title'}}/>
            <TextWidget wkey={'sub_title'} defaultData={{fr: 'Sous titre par défault', en: 'Default sub title'}}/>
            <CardWidget wkey={'homepage_card'}/>
            <button className={'text-white w-fit bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'} onClick={() => navigate({to: '/about'})}>Go to about</button>
        </div>
    );
}
