import { describe, it, expect } from 'vitest';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import loadSpeakers from '../../src/_data/speakers.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sessionsPath = join(__dirname, '..', '..', 'src', '_data', 'sessions.json');

const speakerRoles = ['first', 'second'];
const speakerFields = ['JobTitle', 'Url', 'BioPicUrl', 'TileImageLocation', 'Bio'];

function readJson(filePath) {
    return JSON.parse(readFileSync(filePath, 'utf8'));
}

function normalize(value) {
    return (value || '').trim();
}

describe('sessions speaker data quality', () => {
    it('uses profile fields from the newest session id per speaker', () => {
        const sessions = readJson(sessionsPath);
        const { all: speakerList } = loadSpeakers();
        const speakerByName = new Map(speakerList.map((speaker) => [speaker.name, speaker]));
        const speakerOccurrences = new Map();

        for (const session of sessions) {
            for (const role of speakerRoles) {
                const name = normalize(session[`${role}SpeakerName`]);
                if (!name) continue;

                const records = speakerOccurrences.get(name) || [];
                records.push({ sessionId: session.id, role, session });
                speakerOccurrences.set(name, records);
            }
        }

        for (const [name, records] of speakerOccurrences) {
            const newest = records.reduce((acc, cur) => (cur.sessionId > acc.sessionId ? cur : acc));
            const output = speakerByName.get(name);

            expect(output).toBeDefined();

            for (const field of speakerFields) {
                const source = newest.session[`${newest.role}Speaker${field}`];
                const outputField = field.charAt(0).toLowerCase() + field.slice(1);
                expect(normalize(output[outputField])).toBe(normalize(source));
            }
        }
    });
});
