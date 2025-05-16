import {BaseIssue, BaseSchema} from "valibot";
import * as v from "valibot";

export const validate = <TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(schema: TSchema, value: any) => {
    const result = v.safeParse(schema, value);
    if (result.issues) {
        const fields = result.issues.reduce((acc, issue) => {
            if (issue.path) {
                return {
                    ...acc,
                    [issue.path[0].key as string]: [issue.message]
                }
            }
            return acc;
        }, {});
        return {
            fields
        }
    }

}