import {Editor, EditorProps} from "@app/components/core/widget/base/editor";
import {CardWidgetProps} from "@app/components/core/widget/card/card.widget";

export default function CardEditor({data, widget}: EditorProps<CardWidgetProps>) {
    return (
        <Editor<CardWidgetProps> widget={widget} children={({update}) => (
            <>
                <h2 className="text-lg font-semibold mb-4">Card Widget Editor</h2>
                <p className="text-gray-600 mb-2">Edit the properties of the card widget below:</p>
                <div className="space-y-4">
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium text-gray-700">Title</label>
                        <input type="text" placeholder="Card title" className="border rounded p-2"/>
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium text-gray-700">Description</label>
                        <textarea placeholder="Card description" className="border rounded p-2 h-24">{data.description}</textarea>
                    </div>
                </div>
            </>
        )}/>
    )
}