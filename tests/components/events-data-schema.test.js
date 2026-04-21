import { describe, it, expect } from 'vitest';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const eventsPath = join(__dirname, '..', '..', 'src', '_data', 'events.json');
const sessionsPath = join(__dirname, '..', '..', 'src', '_data', 'sessions.json');

function readJson(filePath) {
    return JSON.parse(readFileSync(filePath, 'utf8'));
}

describe('events.json schema', () => {
    it('includes sessionIDs array for every event', () => {
        const events = readJson(eventsPath);

        for (const ev of events) {
            expect(Array.isArray(ev.sessionIDs)).toBe(true);
        }
    });

    it('stores the same reverse links as sessions.eventID', () => {
        const events = readJson(eventsPath);
        const sessions = readJson(sessionsPath);

        const sessionIdsByEventId = sessions.reduce((acc, session) => {
            if (session.eventID == null || session.id == null) {
                return acc;
            }

            if (!acc[session.eventID]) {
                acc[session.eventID] = [];
            }

            acc[session.eventID].push(session.id);
            return acc;
        }, {});

        for (const ev of events) {
            const expected = (sessionIdsByEventId[ev.id] || []).slice().sort((a, b) => a - b);
            const actual = ev.sessionIDs.slice().sort((a, b) => a - b);
            expect(actual).toEqual(expected);
        }
    });
});
