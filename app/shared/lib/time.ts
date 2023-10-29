import moment from "moment";

export function formatMillisToMinSec(millis: number) {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);

    return +seconds === 60
        ? minutes + 1 + ":00"
        : minutes + ":" + (+seconds < 10 ? "0" : "") + seconds;
}

export function formatTrackDate(date: string) {
    const currentDate = moment();
    const inputDate = moment(date);
    const diffInDays = currentDate.diff(inputDate, "days");

    if (diffInDays < 7) return moment(inputDate).fromNow();
    else return inputDate.format("D MMM. YYYY");
}
