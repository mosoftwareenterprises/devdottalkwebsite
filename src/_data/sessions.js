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
            id: session.id ?? `session-${idx}`,
            durationText: `${session.duration} mins`
        };
    });

    const pastEvents = enriched.filter(s => s.status === 'past');
    const upcomingEvents = [...enriched.filter(s => s.status === 'upcoming')].sort((a, b) => {
        const aIsZero = a.eventID === 0;
        const bIsZero = b.eventID === 0;

        if (aIsZero && !bIsZero) return 1;
        if (!aIsZero && bIsZero) return -1;
        return a.eventID - b.eventID;
    });
    
    // helper function to find a session by ID
    const findById = (id) => {
        return enriched.find(s => s.id === id);
    };

    // export multiple collections so templates can pick what they need
    return {
        allEvents: enriched,
        pastEvents,
        upcomingEvents,
        findById
    };
};
