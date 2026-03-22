/**
 * Mock session data for testing components
 * NOTE: Uses fake IDs (999+) and fictional data to avoid conflicts with real website data
 */
export const mockSessions = [
  {
    id: 999,
    eventID: 'test-event-march-2026',
    title: 'Testing Quantum Debugging Techniques',
    duration: '45',
    durationText: '45 mins',
    firstSpeakerName: 'Alice Fictional Developer',
    firstSpeakerUrl: 'https://www.linkedin.com/in/alice-fictional-test/',
    firstSpeakerJobTitle: 'Test Framework Architect',
    firstSpeakerBio: 'Alice specializes in testing methodologies and mock data generation for component validation.',
    firstSpeakerBioPicUrl: '',
    secondSpeakerBioPicUrl: '',
    firstSpeakerTileImageLocation: '/images/test/alice-tile.png',
    secondSpeakerTileImageLocation: '',
    description: 'Discover advanced techniques for debugging quantum-inspired testing frameworks and CI/CD pipelines.',
    videoUrl: 'https://test-youtube.local/mock-video-1',
    slidesUrl: '',
    status: 'upcoming'
  },
  {
    id: 998,
    eventID: 'test-event-march-2026',
    title: 'Fictional Frameworks: Not Your Regular Stack',
    duration: '45',
    durationText: '45 mins',
    firstSpeakerName: 'Bob Test Sample',
    firstSpeakerUrl: 'https://www.linkedin.com/in/bob-test-sample/',
    firstSpeakerJobTitle: 'Mock Data Specialist',
    firstSpeakerBio: 'Bob creates realistic test fixtures that dont interfere with production search results.',
    firstSpeakerBioPicUrl: '',
    secondSpeakerBioPicUrl: '',
    firstSpeakerTileImageLocation: '/images/test/bob-tile.png',
    secondSpeakerTileImageLocation: '',
    description: 'Learn how to design test data that integrates seamlessly without polluting your search indexes.',
    videoUrl: 'https://test-youtube.local/mock-qa-1',
    slidesUrl: 'https://slides.test.local/bob-slides',
    status: 'past'
  },
  {
    id: 997,
    eventID: 'test-event-january-2026',
    title: 'Containerized Testing: Isolation Strategies',
    duration: '45',
    durationText: '45 mins',
    firstSpeakerName: 'Charlie Testington',
    firstSpeakerUrl: 'https://www.linkedin.com/in/charlie-testington/',
    firstSpeakerJobTitle: 'Isolation Engineer',
    firstSpeakerBio: 'Charlie focuses on container-based testing to ensure test data never leaks into production.',
    firstSpeakerBioPicUrl: '',
    secondSpeakerBioPicUrl: '',
    firstSpeakerTileImageLocation: '/images/test/charlie-tile.png',
    secondSpeakerTileImageLocation: '',
    description: 'Explore containerized testing approaches that completely isolate test fixtures from real data.',
    videoUrl: 'https://www.youtube.com/watch?v=test-video-998',
    slidesUrl: 'https://slides.test.local/charlie-slides',
    status: 'past'
  },
  {
    id: 996,
    eventID: 'test-event-january-2026',
    title: 'Mocking Module Redux: Advanced Patterns',
    duration: '45',
    durationText: '45 mins',
    firstSpeakerName: 'Diana Mock Expert',
    firstSpeakerUrl: 'https://www.linkedin.com/in/diana-mock-expert/',
    firstSpeakerJobTitle: 'Fixture Design Lead',
    firstSpeakerBio: 'Diana specializes in designing mock data architectures that prevent search result contamination.',
    firstSpeakerBioPicUrl: '',
    secondSpeakerBioPicUrl: '',
    firstSpeakerTileImageLocation: '/images/test/diana-tile.png',
    secondSpeakerTileImageLocation: '',
    description: 'Advanced patterns for creating isolated test fixtures that remain invisible to search engines and queries.',
    videoUrl: 'https://www.youtube.com/watch?v=test-video-997',
    slidesUrl: 'https://slides.test.local/diana-slides',
    status: 'past'
  },
  {
    id: 995,
    eventID: 'test-event-february-2026',
    title: 'Test Framework Overview',
    duration: '30',
    durationText: '30 mins',
    firstSpeakerName: 'Elliot Example',
    firstSpeakerUrl: 'https://www.linkedin.com/in/elliot-example/',
    firstSpeakerJobTitle: 'Testing Advocate',
    firstSpeakerBio: 'Elliot speaks about turning event sessions into reliable content artifacts.',
    firstSpeakerBioPicUrl: '',
    secondSpeakerBioPicUrl: '',
    firstSpeakerTileImageLocation: '/images/test/elliot-tile.png',
    secondSpeakerTileImageLocation: '',
    description: 'A concise overview of practical test framework decisions and trade-offs.',
    videoUrl: 'https://test-youtube.local/mock-feb',
    slidesUrl: '',
    status: 'past'
  }
];

/**
 * Mock event data for testing components
 * NOTE: Uses fake URLs and test event IDs to avoid conflicts with real website data
 */
export const mockEvents = [
  {
    id: 'test-event-march-2026',
    displayDate: '15 March 2026',
    url: 'https://test.meetup.local/test-events/example-mock',
    title: 'Mock Testing Mock Workshop',
    photoUrl: 'https://test-photos.local/march-mock',
    overview: 'A practical meetup focused on testing patterns and debugging workflows.'
  },
  {
    id: 'test-event-january-2026',
    displayDate: '20 January 2026',
    url: 'https://test.meetup.local/test-events/example-mock-2',
    title: 'Fictional Meetup Experience',
    photoUrl: 'https://test-photos.local/january-mock',
    overview: 'A January session with engineering talks and community discussion.'
  },
  {
    id: 'test-event-february-2026',
    displayDate: '17 February 2026',
    url: 'https://test.meetup.local/test-events/example-mock-3',
    title: 'Test Data Deep Dive',
    photoUrl: 'https://test-photos.local/february-mock',
    overview: 'A deep dive into practical test data strategies for teams.'
  }
];
