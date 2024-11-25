// import type { TimeLocaleDefinition } from "d3-time-format";

// export const frFRLocale = {
//   dateTime: "%A %e %B %Y à %X",
//   date: "%d/%m/%Y",
//   time: "%H:%M:%S",
//   periods: ["AM", "PM"],
//   days: [
//     "dimanche",
//     "lundi",
//     "mardi",
//     "mercredi",
//     "jeudi",
//     "vendredi",
//     "samedi",
//   ],
//   shortDays: ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."],
//   months: [
//     "janvier",
//     "février",
//     "mars",
//     "avril",
//     "mai",
//     "juin",
//     "juillet",
//     "août",
//     "septembre",
//     "octobre",
//     "novembre",
//     "décembre",
//   ],
//   shortMonths: [
//     "janv.",
//     "févr.",
//     "mars",
//     "avr.",
//     "mai",
//     "juin",
//     "juil.",
//     "août",
//     "sept.",
//     "oct.",
//     "nov.",
//     "déc.",
//   ],
// } satisfies TimeLocaleDefinition;

/* Convert a date string formatted as an ISO date to a Unix epoch in seconds */
export function isoDateToTimestamp(isoDate: string | undefined): number {
  if (!isoDate) isoDate = new Date().toISOString();
  return getTimestampInSeconds(new Date(isoDate));
}

/** @deprecate in favor of getUnixTime from the "date-fns" package
 * Return the Date argument or the current timestamp to a Unix epoch in seconds */
export function getTimestampInSeconds(date?: Date) {
  if (!date) date = new Date();
  return parseInt((date.getTime() / 1000).toFixed(0));
}

/** @deprecate in favor of formatISO from the "date-fns" package
 * Return date as a simple YYYY-MM-DD formatted date */
export function formatIsoDate(date?: Date): string {
  if (!date) date = new Date();
  if (isNaN(date.valueOf())) throw new TypeError("Invalid date");
  const [datePart] = date.toISOString().split("T");
  return datePart ?? "";
}

export function getListOfDaysBetweenDates(
  startDate: Date,
  endDate: Date,
): string[] {
  const dates: string[] = [];
  while (startDate <= endDate) {
    dates.push(formatIsoDate(startDate));
    startDate.setDate(startDate.getDate() + 1);
  }
  return dates;
}
