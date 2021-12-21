import type Append from "./types/Append";
import type Arrow from "./types/Arrow";
import type Cast from "./types/Cast";
import type Tail from "./types/Tail";

type HasItem<T extends any[]> = T extends [any, ...any] ? true : false;

type ParameterTuples<FS extends Arrow[], T = []> = HasItem<FS> extends true
  ? ParameterTuples<Tail<FS>, Append<Cast<T, any[]>, Parameters<FS[0]>>>
  : T;

type And<T extends any[], R = T[0]> = HasItem<T> extends true
  ? And<Tail<T>, R & T[0]>
  : R;

type JuxtArgs<
  FS extends Arrow[],
  R = Cast<And<ParameterTuples<FS>>, any[]>,
> = R extends never ? undefined : R;

type ReturnTuples<FS extends Arrow[], T = []> = HasItem<FS> extends true
  ? ReturnTuples<Tail<FS>, Append<Cast<T, any[]>, ReturnType<FS[0]>>>
  : T;

type JuxtReturnTypes<ARGS, FS extends Arrow[]> = ARGS extends undefined
  ? void
  : ReturnTuples<FS>;

function juxt<FS extends Arrow[]>(
  fs: [...FS] | readonly [...FS],
): (...args: JuxtArgs<FS>) => JuxtReturnTypes<JuxtArgs<FS>, FS> {
  return (...args: JuxtArgs<FS>) => fs.map((f: Arrow) => f(...args)) as any;
}

export default juxt;
