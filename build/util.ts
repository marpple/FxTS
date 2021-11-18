import glob from "glob";

export const searchFiles = (pattern: string): Promise<string[]> =>
  new Promise((resolve, reject) => {
    glob(pattern, function (err, files) {
      if (err) reject(err);
      else resolve(files);
    });
  });
