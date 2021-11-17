/**
 * from ts-toolbelt repository
 * https://github.com/millsp/ts-toolbelt
 */

type Cast<T1, T2> = T1 extends T2 ? T1 : T2;

export default Cast;
