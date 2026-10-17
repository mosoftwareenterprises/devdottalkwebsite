import { describe, it, expect } from 'vitest';
import { openSpeakerSlots } from '../../lib/open-speaker-slots.js';

const event = (overrides = {}) => ({ id: 1, date: '2027-04-28', sessionIDs: [], ...overrides });
const session = (overrides = {}) => ({
    id: 100,
    eventID: 0,
    title: 'A talk',
    firstSpeakerName: 'Jane Doe',
    ...overrides
});

describe('openSpeakerSlots', () => {
    it('offers both slots when no sessions exist', () => {
        const [result] = openSpeakerSlots([event()], []);
        expect(result.openSlots).toBe(2);
    });

    it('formats the date as DD/MM/YY', () => {
        const [result] = openSpeakerSlots([event({ date: '2027-04-08' })], []);
        expect(result.shortDate).toBe('08/04/27');
    });

    it('keeps the original event fields', () => {
        const [result] = openSpeakerSlots([event({ fullDateLabel: 'Wednesday' })], []);
        expect(result.id).toBe(1);
        expect(result.fullDateLabel).toBe('Wednesday');
    });

    it('counts a session linked by sessionIDs', () => {
        const [result] = openSpeakerSlots([event({ sessionIDs: [100] })], [session()]);
        expect(result.openSlots).toBe(1);
    });

    it('counts a session linked by eventID', () => {
        const [result] = openSpeakerSlots([event()], [session({ eventID: 1 })]);
        expect(result.openSlots).toBe(1);
    });

    it('does not double count a session matched both ways', () => {
        const [result] = openSpeakerSlots([event({ sessionIDs: [100] })], [session({ eventID: 1 })]);
        expect(result.openSlots).toBe(1);
    });

    it('ignores sessions belonging to other events', () => {
        const [result] = openSpeakerSlots([event()], [session({ id: 5, eventID: 2 })]);
        expect(result.openSlots).toBe(2);
    });

    it('ignores placeholder speakers regardless of case or spacing', () => {
        const [result] = openSpeakerSlots(
            [event({ sessionIDs: [100, 101] })],
            [session({ firstSpeakerName: '  It Could Be You! ' }), session({ id: 101, firstSpeakerName: '' })]
        );
        expect(result.openSlots).toBe(2);
    });

    it('ignores Lean Coffee sessions', () => {
        const [result] = openSpeakerSlots([event({ sessionIDs: [100] })], [session({ title: ' Lean Coffee Session ' })]);
        expect(result.openSlots).toBe(2);
    });

    it('omits events that are full', () => {
        const result = openSpeakerSlots(
            [event({ sessionIDs: [100, 101] })],
            [session(), session({ id: 101, firstSpeakerName: 'John Doe' })]
        );
        expect(result).toEqual([]);
    });

    it('omits cancelled and no-event months', () => {
        const result = openSpeakerSlots([event({ isCancelled: true }), event({ id: 2, isNoEventMonth: true })], []);
        expect(result).toEqual([]);
    });

    it('handles missing events and sessions', () => {
        expect(openSpeakerSlots(undefined, undefined)).toEqual([]);
        expect(openSpeakerSlots([event()], undefined)[0].openSlots).toBe(2);
    });
});
