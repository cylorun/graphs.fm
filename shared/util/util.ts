
export function parseReleaseDate(releaseDate: string, precision: "year" | "month" | "day"): string {
    let fullDate = releaseDate;

    if (precision === "year") {
        fullDate += "-01-01"; // default to Jan 1st
    } else if (precision === "month") {
        fullDate += "-01";    // default to 1st of the month
    }

    return new Date(fullDate).toISOString();
}