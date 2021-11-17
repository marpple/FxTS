import { LAST_EXCEPT } from "./SignatureMap";
export const Signature = {
  text: "<b>Signature:</b>",
  skip: 2,
};

export const SignatureOut = {
  text: "<b>Signature:</b>",
  skip: (index: number, splited: string[]) => {
    for (let i = index + 2; i < splited.length; i++) {
      if (splited[i] === LAST_EXCEPT) {
        return i - index + 1;
      }
    }

    return 0;
  },
};

export const FuncParameters = {
  text: "## Parameters",
  skip: 2,
};

export const FuncReturn = {
  text: "<b>Returns:</b>",
  skip: 2,
};

export type SignatureType =
  | typeof Signature
  | typeof SignatureOut
  | typeof FuncParameters
  | typeof FuncReturn;
