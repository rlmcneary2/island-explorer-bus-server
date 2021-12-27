import { promises as fs } from "fs";
import {
  HandlerContext,
  HandlerEvent,
  HandlerResponse
} from "@netlify/functions";

export async function handler(
  event: HandlerEvent,
  context: HandlerContext
): Promise<HandlerResponse> {
  const { routeIDs } = event.queryStringParameters;
  if (!routeIDs) {
    return {
      body: "No routeIDs param.",
      statusCode: 400
    };
  }

  let id: number;
  try {
    id = +routeIDs;
  } catch {
    return {
      body: `Failed to parse routeIDs='${routeIDs}' to a number.`,
      statusCode: 400
    };
  }

  const dataPathname =
    process.cwd() + "/apps/functions/src/GetAllVehiclesForRoutes/data";

  const filenames = (await fs.readdir(dataPathname)).sort();

  const lastFilename = event.headers["cookie"]
    ? event.headers["cookie"].split("=")[1]
    : null;

  let filename = filenames[0];
  if (lastFilename) {
    for (let i = 0; i < filenames.length; i++) {
      if (filenames[i] === lastFilename) {
        if (i + 1 < filenames.length) {
          filename = filenames[i + 1];
        } else {
          filename = filenames[0];
        }
      }
    }
  }

  const file = JSON.parse(
    (await fs.readFile(`${dataPathname}/${filename}`)).toString()
  );

  const response: HandlerResponse = {
    body: JSON.stringify(file.filter(x => x.RouteId === id)),
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": `file-name=${filename}; SameSite=None; Secure`
    },
    statusCode: 200
  };

  return response;
}
