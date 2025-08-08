import {CreateWidget, UpdateWidget, Widget} from "@entity/widget.entity";
import {ResultAsync} from "neverthrow";
import {DbException} from "@infra/exception/db.exception";
import {Option} from "fp-ts/Option";

type Result<T> = ResultAsync<T, DbException>;

export type WidgetInterface = {
    create: <T = object>(widget: CreateWidget) => Result<Widget<T>>;
    update: <T = object>(id: string, widget: UpdateWidget<T>) => Result<Widget<T>>;
    delete: <T = object>(id: string) => Result<Widget<T>>;
    findById: <T = object>(id: string) => Result<Option<Widget<T>>>;
    findAll: <T = object>() => Result<Widget<T>[]>;
}