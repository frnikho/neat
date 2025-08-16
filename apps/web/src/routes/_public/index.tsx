import {createFileRoute, useNavigate} from "@tanstack/react-router";
import {TextWidget} from "@app/components/widgets/text.widget";

export const Route = createFileRoute("/_public/")({
	component: RouteComponent,
});

function RouteComponent() {

    const navigate = useNavigate();

	return (
        <>
            <TextWidget wkey={'main_title'} defaultData={{fr: 'Titre par défault', en: 'Default title'}}/>
            <TextWidget wkey={'sub_title'} defaultData={{fr: 'Sous titre par défault', en: 'Default sub title'}}/>
            <button className={'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'} onClick={() => navigate({to: '/about'})}>Go to about</button>
        </>
    );
}
