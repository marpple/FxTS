import Arrow from "../src/types/Arrow";

export const callFuncAfterTime = (callback: Arrow, time = 1000) => {
  setTimeout(callback, time);
};
