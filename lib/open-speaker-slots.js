export const SLOTS_PER_EVENT = 2;
const PLACEHOLDER_SPEAKER = 'it could be you!';
const COMMUNITY_LED_TITLE = 'lean coffee session';

function normalise(value) {
    return (value || '').trim().toLowerCase();
}

function belongsToEvent(session, event) {
    if (Array.isArray(event.sessionIDs) && event.sessionIDs.includes(session.id)) {
        return true;
    }
    return session.eventID !== undefined && session.eventID === event.id;
}

// Lean Coffee is community-led, and placeholder sessions have no speaker yet.
function takesSpeakerSlot(session) {
    if (normalise(session.title) === COMMUNITY_LED_TITLE) {
        return false;
    }
    const speaker = normalise(session.firstSpeakerName);
    return speaker !== '' && speaker !== PLACEHOLDER_SPEAKER;
}

function formatShortDate(isoDate) {
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year.slice(2)}`;
}

// Events that can still take speakers, each with its remaining slot count and DD/MM/YY date.
export function openSpeakerSlots(events, sessions) {
    return (events || [])
        .filter(event => !event.isCancelled && !event.isNoEventMonth)
        .map(event => {
            const filled = (sessions || []).filter(
                session => belongsToEvent(session, event) && takesSpeakerSlot(session)
            ).length;
            return {
                ...event,
                openSlots: SLOTS_PER_EVENT - filled,
                shortDate: formatShortDate(event.date)
            };
        })
        .filter(event => event.openSlots > 0);
}
