const dayStrings = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthStrings = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

// add a leading 0 to a number if it is only one digit
function addLeadingZero(num) {
	num = num.toString();
	while (num.length < 2) num = `0${num}`;
	return num;
}

export function buildRFC822Date(dateString) {
	const timeStamp = Date.parse(dateString);
	const date = new Date(timeStamp);

	const day = dayStrings[date.getDay()];
	const dayNumber = addLeadingZero(date.getDate());
	const month = monthStrings[date.getMonth()];
	const year = date.getFullYear();
	const time = `${addLeadingZero(date.getHours())}:${addLeadingZero(date.getMinutes())}:00`;
	const timezone = date.getTimezoneOffset() === 0 ? "GMT" : "BST";

	//Wed, 02 Oct 2002 13:00:00 GMT
	return `${day}, ${dayNumber} ${month} ${year} ${time} ${timezone}`;
}

export function shortDate(dateString, showTime = false) {
	const timeStamp = Date.parse(dateString);
	const date = new Date(timeStamp);

	const dayNumber = addLeadingZero(date.getDate());
	const month = monthStrings[date.getMonth()];
	const year = date.getFullYear();

	const time = `${addLeadingZero(date.getHours())}:${addLeadingZero(date.getMinutes())}`;

	return `${dayNumber} ${month}, ${year} ${showTime ? time : ""}`;
}

export function sinceNow(dateString) {
	const timeStamp = Date.parse(dateString);
	const date = new Date(timeStamp);

	// const second = date.getUTCSeconds()
	// const minute = date.getUTCMinutes()
	// const hour = date.getUTCHours()

	// const dayNumber = addLeadingZero(date.getUTCDate());
	// const month = monthStrings[date.getUTCMonth()];
	// const year = date.getUTCFullYear();

	const start = Temporal.PlainDateTime.from(dateString);
	const now = Temporal.Now.plainDateTimeISO();

	const elapsed = now.since(start);

	const units = ["years", "months", "days", "hours", "minutes", "seconds"];

	for (const key of units) {
		const value = elapsed[key];

		if (key === "seconds" ? value >= 10 : value >= 1) {
			return `${value} ${value > 1 ? key : key.toString().replace(/s$/, "")} ago`;
		}
	}

	return "now";
}
