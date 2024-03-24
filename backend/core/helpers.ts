import util from "util";
import childProcess from "child_process";

interface ExecResult {
  stderr: string;
  stdout: string;
}

export const exec = async (cmd: string): Promise<ExecResult> => {
  const execute = util.promisify(childProcess.exec);
  return execute(cmd);
};

export const series = async (cmds: string[]): Promise<string | null> => {
  /* eslint-disable no-restricted-syntax, no-await-in-loop */
  for (const cmd of cmds) {
    const { stderr, stdout } = await exec(cmd);

    if (stderr) {
      console.log(stderr);
      console.log(stdout);
      return stderr;
    }
  }
  return null;
};

export const allPropertiesAreNull = (obj: any): boolean => {
  for (const key in obj) {
    if (obj[key]) {
      return false;
    }
  }
  return true;
};

export const uniqBy = <T>(array: T[], key: keyof T): T[] => {
  return [...new Map(array.map((item) => [item[key], item])).values()];
};

export const formatSqlData = async <T>(
  data: string,
  uniqProperty?: keyof T
): Promise<T[]> => {
  try {
    const result: T[] = JSON.parse(data);

    if (result && result.length) {
      const isArrayEmpty = allPropertiesAreNull(result[0]);
      return isArrayEmpty
        ? []
        : uniqProperty
        ? uniqBy(result, uniqProperty)
        : result;
    }

    return [];
  } catch (error: any) {
    console.log(`Error happened in formatting SQL query: `, error);
    return [];
  }
};
