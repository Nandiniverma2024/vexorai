export function entriesToMarkdown(entries, type){
    if (!entries.length) return ""; //If entries doesn't have anything return empty

    return ( //But if does return this
        `## ${type}\n\n` + //Type => experience/education etc..
        entries
        .map((entry) => {
            const dateRange = entry.current //If current date is present
                ? `${entry.startDate} - Present` //then startDate to present
                : `${entries.startDate} - ${entries.endDate}`; //else startDate to endDate
            return `### ${entry.title} @${entry.Organisation}\n${dateRange}\n\n${entry.description}`;
        })
        .join("\n\n")
    );
}