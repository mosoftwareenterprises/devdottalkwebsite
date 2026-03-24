import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Derive a unique speakers list from sessions.json, deduplicating by name
// and merging session history for speakers who have presented multiple times.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sessionsPath = path.join(__dirname, 'sessions.json');
const raw = fs.readFileSync(sessionsPath, 'utf-8');
const list = JSON.parse(raw);

export default () => {
    const speakerMap = new Map();

    const addSpeaker = (name, jobTitle, url, bioPicUrl, tileImageLocation, bio, session) => {
        if (!name) return;
        if (!speakerMap.has(name)) {
            speakerMap.set(name, {
                name,
                jobTitle,
                url,
                bioPicUrl,
                tileImageLocation,
                bio,
                profileSessionId: session.id,
                sessions: []
            });
        }
        const speaker = speakerMap.get(name);

        // Data policy: profile fields (bio, job title, etc.) are taken from the session
        // with the highest id for that speaker. This means if a speaker updates their
        // details between appearances, the newest version is always shown on the site.
        if (session.id > speaker.profileSessionId) {
            speaker.jobTitle = jobTitle;
            speaker.url = url;
            speaker.bioPicUrl = bioPicUrl;
            speaker.tileImageLocation = tileImageLocation;
            speaker.bio = bio;
            speaker.profileSessionId = session.id;
        }

        speaker.sessions.push({ id: session.id, title: session.title, videoUrl: session.videoUrl, status: session.status });
    };

    for (const session of list) {
        addSpeaker(
            session.firstSpeakerName,
            session.firstSpeakerJobTitle,
            session.firstSpeakerUrl,
            session.firstSpeakerBioPicUrl,
            session.firstSpeakerTileImageLocation,
            session.firstSpeakerBio,
            session
        );
        if (session.secondSpeakerName) {
            addSpeaker(
                session.secondSpeakerName,
                session.secondSpeakerJobTitle,
                session.secondSpeakerUrl,
                session.secondSpeakerBioPicUrl,
                session.secondSpeakerTileImageLocation,
                session.secondSpeakerBio,
                session
            );
        }
    }

    // Sort alphabetically by last name
    const all = [...speakerMap.values()]
        .map(({ profileSessionId, ...speaker }) => speaker)
        .sort((a, b) => {
            const lastA = a.name.trim().split(/\s+/).pop().toLowerCase();
            const lastB = b.name.trim().split(/\s+/).pop().toLowerCase();
            return lastA.localeCompare(lastB);
        });

    return { all };
};
