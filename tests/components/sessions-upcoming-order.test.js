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
    it('pushes Mark Oliver first-speaker sessions to the bottom of the upcoming list', () => {
        const { upcomingEvents } = loadSessions();
        const firstMarkOliverIndex = upcomingEvents.findIndex(hasMarkOliverFirstSpeaker);
        const secondSpeakerOnlyIndex = upcomingEvents.findIndex((session) => {
            return session.firstSpeakerName !== 'Mark Oliver' && session.secondSpeakerName === 'Mark Oliver';
        });

        expect(firstMarkOliverIndex).toBeGreaterThan(-1);
        expect(secondSpeakerOnlyIndex).toBeGreaterThan(-1);
        expect(secondSpeakerOnlyIndex).toBeLessThan(firstMarkOliverIndex);

        const sessionsAfterFirstMarkOliver = upcomingEvents.slice(firstMarkOliverIndex);

        expect(sessionsAfterFirstMarkOliver.every(hasMarkOliverFirstSpeaker)).toBe(true);
        expect(upcomingEvents.slice(0, firstMarkOliverIndex).every((session) => !hasMarkOliverFirstSpeaker(session))).toBe(true);
    });
});