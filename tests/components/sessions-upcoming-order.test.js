import { describe, it, expect } from 'vitest';
import loadSessions from '../../src/_data/sessions.js';

function hasMarkOliverFirstSpeaker(session) {
    return session.firstSpeakerName === 'Mark Oliver';
}

describe('past sessions ordering', () => {
    it('sorts past sessions by id ascending', () => {
        const { pastEvents } = loadSessions();
        for (let i = 1; i < pastEvents.length; i++) {
            expect(pastEvents[i].id).toBeGreaterThanOrEqual(pastEvents[i - 1].id);
        }
    });
});

describe('upcoming sessions ordering', () => {
    it('excludes Lean Coffee sessions from upcoming sessions list', () => {
        const { upcomingEvents } = loadSessions();

        expect(upcomingEvents.every((session) => session.title !== 'Lean Coffee Session')).toBe(true);
    });

    it('pushes Mark Oliver first-speaker sessions to the bottom of the upcoming list', () => {
        const { upcomingEvents } = loadSessions();
        const firstMarkOliverIndex = upcomingEvents.findIndex(hasMarkOliverFirstSpeaker);
        const nonMarkOliverFirstSpeakerCount = upcomingEvents.filter((session) => {
            return !hasMarkOliverFirstSpeaker(session);
        }).length;

        if (firstMarkOliverIndex === -1) {
            expect(nonMarkOliverFirstSpeakerCount).toBe(upcomingEvents.length);
            return;
        }

        const sessionsAfterFirstMarkOliver = upcomingEvents.slice(firstMarkOliverIndex);

        expect(sessionsAfterFirstMarkOliver.every(hasMarkOliverFirstSpeaker)).toBe(true);
        expect(upcomingEvents.slice(0, firstMarkOliverIndex).every((session) => !hasMarkOliverFirstSpeaker(session))).toBe(true);
    });
});