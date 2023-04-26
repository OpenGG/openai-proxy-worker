import { readRequest } from "./readRequest.ts";

type IResult<T> = [true, string, T] | [false, string];

const parseJSON = <T>(text: string): IResult<T> => {
  let json: T;
  try {
    json = JSON.parse(text);
  } catch (e) {
    return [false, "Invalid json input"];
  }

  return [true, text, json];
};

export const jsonFilter = async <T>(
  request: Request,
  limit: number,
): Promise<IResult<T>> => {
  const [success, text] = await readRequest(request, limit);

  if (!success) {
    return [false, text];
  }

  return parseJSON<T>(text);
};
