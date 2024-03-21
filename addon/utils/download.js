import { DateTime } from "luxon";

export function isDownloadUrlExpired(url) {
  const expiryRegex = /expires=([0-9]+)/;
  const match = url.match(expiryRegex);
  return DateTime.fromSeconds(Number(match[1])) < DateTime.now();
}
