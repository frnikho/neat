import {TextWidgetProps} from "@app/components/widgets/text.widget";
import { useAppForm } from "@app/components/ui/tanstack-form";
import {Type} from "@sinclair/typebox";
import {TypeCompiler} from "@sinclair/typebox/compiler";
import {typeBoxValidator} from "@app/lib/validation";
import {Editor} from "@app/components/widgets/editor";
import {WidgetResponse} from "@neat/types/widget";
import {Input} from "@app/components/ui/input";
import {FormEvent, useCallback} from "react";
import {Button} from "@app/components/ui/button";

const textWidgetSchema = Type.Object({
    fr: Type.String({ title: "French Value", description: "The value in French" }),
    en: Type.Optional(Type.String({ title: "English Value", description: "The value in English" })),
}, { additionalProperties: false });

const compiler = TypeCompiler.Compile(textWidgetSchema);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default function TextWidgetEditor({data, widget}: {data: TextWidgetProps, widget: WidgetResponse}) {

    return (
        <Editor<TextWidgetProps> widget={widget} children={({update}) => {

            const form = useAppForm({
                validators: {
                    onSubmit: ({value}) => typeBoxValidator(compiler, value)
                },
                defaultValues: {
                    ...data
                },
                onSubmit: ({value}) => updateWidget(value)
            });

            const handleSubmit = useCallback(
                (e: FormEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                    void form.handleSubmit();
                },
                [form],
            );

            const updateWidget = async (value: TextWidgetProps) => {
                //await sleep(10000);
                update(value);
            }

            return (
                <div>
                    <form.AppForm>
                        <form className={"flex flex-col gap-4"} onSubmit={handleSubmit}>
                            <form.AppField
                                name="fr"
                                children={(f) => (
                                    <f.FormItem>
                                        <f.FormLabel>Valeur</f.FormLabel>
                                        <f.FormControl>
                                            <Input
                                                onBlur={f.handleBlur}
                                                onChange={(e) => f.handleChange(e.target.value)}
                                                placeholder={data[f.name]}
                                                type={"text"}
                                                value={f.state.value}
                                            />
                                        </f.FormControl>
                                        <f.FormMessage />
                                    </f.FormItem>
                                )}
                            />
                            <form.AppField
                                name="en"
                                children={(f) => (
                                    <f.FormItem>
                                        <f.FormLabel>Valeur</f.FormLabel>
                                        <f.FormControl>
                                            <Input
                                                onBlur={f.handleBlur}
                                                onChange={(e) => f.handleChange(e.target.value)}
                                                placeholder={data[f.name]}
                                                type={"text"}
                                                value={f.state.value}
                                            />
                                        </f.FormControl>
                                        <f.FormMessage />
                                    </f.FormItem>
                                )}
                            />
                            <form.Subscribe children={({canSubmit, isSubmitting}) =>
                                (<Button loading={isSubmitting} disabled={!canSubmit} type={'submit'}>Save</Button>)
                            }/>
                        </form>
                    </form.AppForm>
                </div>
            )
        }}/>
    )
}