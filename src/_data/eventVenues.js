const venueDefinitions = {
    k101: {
        key: 'k101',
        name: 'Room K101, Kimmeridge House',
        template: 'venues/k101-location-data.njk'
    }
};

const venueNameToKey = {
    'room k101, kimmeridge house': 'k101'
};

function normalize(value) {
    return String(value || '').trim().toLowerCase();
}

export default () => {
    const all = Object.values(venueDefinitions);

    const findByKey = (key) => {
        return venueDefinitions[normalize(key)] || null;
    };

    const findByEvent = (eventRecord) => {
        if (!eventRecord) {
            return null;
        }

        const explicitKey = normalize(eventRecord.venueKey);
        if (explicitKey && venueDefinitions[explicitKey]) {
            return venueDefinitions[explicitKey];
        }

        const mappedKey = venueNameToKey[normalize(eventRecord.venueName)];
        if (mappedKey && venueDefinitions[mappedKey]) {
            return venueDefinitions[mappedKey];
        }

        return null;
    };

    return {
        all,
        findByKey,
        findByEvent
    };
};