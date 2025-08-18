import {TextWidget} from "@app/components/widgets/text/text.widget";

export default function HomePage() {

    return (
        <div className={'p-4'}>
            <TextWidget wkey={'main_title'} defaultData={{fr: 'Titre par défault', en: 'Default title'}}/>
            <TextWidget wkey={'sub_title'} defaultData={{fr: 'Sous titre par défault', en: 'Default sub title'}}/>
        </div>
    )
}