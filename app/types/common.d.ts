type NotArray<Type> = Type & {length?: never};

type IWithId<
  Model extends NotArray<object>,
  IdType extends string = string,
> = Model & {
  id: IdType;
};

type Maybe<Type> = Type | undefined | null | void;

type IMaybe<Type extends NotArray<object>> = {
  [key in keyof Type]?: Maybe<Type[key]>;
};

type Not<Type> = {
  [key in keyof Type]?: void;
};

type Separate<From, To> = (From & Not<To>) | (To & Not<From>);
