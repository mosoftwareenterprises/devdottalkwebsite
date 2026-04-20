import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const weekdayFormatter = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    timeZone: 'UTC'
});

const shortWeekdayFormatter = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    timeZone: 'UTC'
});

const monthFormatter = new Intl.DateTimeFormat('en-GB', {
    month: 'long',
    timeZone: 'UTC'
});

function getOrdinalSuffix(day) {
    if (day >= 11 && day <= 13) {
        return 'th';
    }

    switch (day % 10) {
        case 1:
            return 'st';
        case 2:
            return 'nd';
        case 3:
            return 'rd';
        default:
            return 'th';
    }
}

function getDateLabels(date) {
    const dateForFormatting = new Date(`${date}T12:00:00Z`);
    const day = dateForFormatting.getUTCDate();
    const ordinalDay = `${day}${getOrdinalSuffix(day)}`;
    const month = monthFormatter.format(dateForFormatting);
    const year = dateForFormatting.getUTCFullYear();
    const fullWeekday = weekdayFormatter.format(dateForFormatting);
    const shortWeekday = shortWeekdayFormatter.format(dateForFormatting);

    return {
        fullWeekday,
        shortWeekday,
        ordinalDay,
        month,
        year,
        fullDateLabel: `${fullWeekday}, ${ordinalDay} ${month} ${year}`,
        floatingDateLabel: `${shortWeekday} ${ordinalDay} ${month}`
    };
}

// load raw array from JSON so that editors can easily read/write the file
// __dirname equivalent in ESM, ensures Windows paths are handled correctly.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const eventsPath = path.join(__dirname, 'events.json');
const raw = fs.readFileSync(eventsPath, 'utf-8');
const list = JSON.parse(raw);

export default () => {
    const now = new Date();

    // enrich each entry with computed fields and sort chronologically
    const enriched = list.map(ev => {
        const dateObj = new Date(ev.date);
        const dateLabels = getDateLabels(ev.date);

        return {
            ...ev,
            dateObj,
            ...dateLabels,
            year: dateObj.getFullYear(),
            status: dateObj < now ? 'past' : 'upcoming'
        };
    });

    enriched.sort((a, b) => a.dateObj - b.dateObj);

    const past = enriched.filter(e => e.status === 'past').reverse();
    const upcoming = enriched.filter(e => e.status === 'upcoming');

    // export multiple collections so templates can pick what they need
    return {
        all: enriched,
        past,
        upcoming,
        findById: id => enriched.find(event => event.id === Number(id)) || null
    };
};