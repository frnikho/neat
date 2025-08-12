import type { CreateWidget, UpdateWidget, Widget } from '@entity/widget.entity';
import type { DbException } from '@infra/exception/db.exception';
import type { Option } from 'fp-ts/Option';
import type { ResultAsync } from 'neverthrow';

type Result<T> = ResultAsync<T, DbException>;

export type WidgetInterface = {
  create: <T = object>(widget: CreateWidget) => Result<Widget<T>>;
  update: <T = object>(
    id: string,
    widget: UpdateWidget<T>
  ) => Result<Widget<T>>;
  delete: <T = object>(id: string) => Result<Widget<T>>;
  findById: <T = object>(id: string) => Result<Option<Widget<T>>>;
  findAll: <T = object>() => Result<Widget<T>[]>;
};
