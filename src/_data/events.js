import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
        return {
            ...ev,
            dateObj,
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
        upcoming
    };
};