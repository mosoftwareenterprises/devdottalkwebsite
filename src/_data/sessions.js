import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// load raw array from JSON so that editors can easily read/write the file
// __dirname equivalent in ESM, ensures Windows paths are handled correctly.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sessionsPath = path.join(__dirname, 'sessions.json');
const raw = fs.readFileSync(sessionsPath, 'utf-8');
const list = JSON.parse(raw);

export default () => {
    // enrich each entry with computed fields and sort by status
    const enriched = list.map((session, idx) => {
        return {
            ...session,
            id: `session-${idx}`,
            durationText: `${session.duration} mins`
        };
    });

    const past = enriched.filter(s => s.status === 'past');
    const upcoming = enriched.filter(s => s.status === 'upcoming');

    // export multiple collections so templates can pick what they need
    return {
        all: enriched,
        past,
        upcoming
    };
};
