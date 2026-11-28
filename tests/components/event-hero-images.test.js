import { describe, expect, it } from "vitest";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import {
  eventHeroFileName,
  eventHeroHtml,
  generateEventHeroImages,
  getEventHeroRecords,
} from "../../lib/generate-event-hero-images.js";

const sessions = [
  {
    id: 47,
    title: "A Talk About Local AI",
    firstSpeakerName: "Alex Example",
    firstSpeakerJobTitle: "Principal Engineer",
    secondSpeakerName: "Sam Example",
    secondSpeakerJobTitle: "AI Engineer",
  },
  {
    id: 48,
    title: "A Solo Talk",
    firstSpeakerName: "Kim Solo",
    firstSpeakerJobTitle: "Developer",
  },
  {
    id: 49,
    title: "Lean Coffee Session",
    firstSpeakerName: "Mark Host",
    firstSpeakerJobTitle: "Host",
  },
  {
    id: 50,
    title: "ALLOCATED to Someone",
    firstSpeakerName: "Mark Host",
    firstSpeakerJobTitle: "Host",
  },
  {
    id: 51,
    title: "Open Slot",
    firstSpeakerName: "It could be you!",
    firstSpeakerJobTitle: "Your Job title here",
  },
];

const events = [
  {
    id: 23,
    displayDate: "November 25th 2026",
    title: "{dev.talk} - The one in November",
    sessionIDs: [47, 48, 49, 50, 51],
  },
  { id: 24, displayDate: "December 16th 2026", sessionIDs: [49, 51] },
];

describe("event hero image generator", () => {
  it("groups speakers under their session in event session order", () => {
    const [record] = getEventHeroRecords(sessions, events);

    expect(record).toMatchObject({
      date: "November 25th 2026",
      year: "2026",
      monthFolder: "november",
    });
    expect(record.sessions.map((session) => session.title)).toEqual([
      "A Talk About Local AI",
      "A Solo Talk",
    ]);
    expect(record.sessions[0].speakers.map((speaker) => speaker.name)).toEqual([
      "Alex Example",
      "Sam Example",
    ]);
  });

  it("skips events with nothing to show", () => {
    expect(getEventHeroRecords(sessions, events)).toHaveLength(1);
  });

  it("names files with the event month and year", () => {
    const [record] = getEventHeroRecords(sessions, events);

    expect(eventHeroFileName(record)).toBe("Hero image - November 2026.png");
  });

  it("renders the logo, date and one banner per session", async () => {
    const [record] = getEventHeroRecords(sessions, events);
    const html = await eventHeroHtml(record, process.cwd());

    expect(html).toContain("November 25th 2026");
    expect(html).toContain("hero-logo");
    expect(html).toContain(
      '<p class="hero-event-title">The one in November</p>'
    );
    expect(html.indexOf("The one in November")).toBeLessThan(
      html.indexOf("November 25th 2026")
    );
    expect(html.match(/class="hero-session"/g) || []).toHaveLength(2);
    expect(html).toContain("A Talk About Local AI");
    expect(html).toContain("Sam Example");
    expect(html.indexOf("A Talk About Local AI")).toBeLessThan(
      html.indexOf("Alex Example")
    );
    expect(html.indexOf("Sam Example")).toBeLessThan(
      html.indexOf("A Solo Talk")
    );
  });

  it("omits the event title line when the event has no title", async () => {
    const [record] = getEventHeroRecords(sessions, [
      { id: 25, displayDate: "May 6th 2026", sessionIDs: [48] },
    ]);
    const html = await eventHeroHtml(record, process.cwd());

    expect(html).not.toContain('<p class="hero-event-title">');
  });

  it("keeps hyphenated names together so they only wrap at spaces", async () => {
    const hyphenated = [
      {
        id: 1,
        title: "Talk",
        firstSpeakerName: "Mary Smith-Jones",
        firstSpeakerJobTitle: "Dev",
      },
    ];
    const [record] = getEventHeroRecords(hyphenated, [
      { id: 1, displayDate: "May 6th 2026", sessionIDs: [1] },
    ]);
    const html = await eventHeroHtml(record, process.cwd());

    expect(html).toContain('Mary <span class="hero-nowrap">Smith-Jones</span>');
  });

  it("writes a 16:9 PNG and skips unchanged files on the next run", async () => {
    const outputRoot = await fs.mkdtemp(path.join(os.tmpdir(), "event-hero-"));
    try {
      const options = {
        sessions,
        events,
        sourceRoot: process.cwd(),
        outputRoot,
      };
      const files = await generateEventHeroImages(options);
      const outputFile = path.join(outputRoot, files[0]);
      const metadata = await sharp(outputFile).metadata();

      expect(files).toEqual([
        "images/2026/november/Hero image - November 2026.png",
      ]);
      expect(metadata.width / metadata.height).toBeCloseTo(16 / 9, 3);

      const oldTime = new Date("2020-01-01T00:00:00Z");
      await fs.utimes(outputFile, oldTime, oldTime);
      await generateEventHeroImages(options);

      expect((await fs.stat(outputFile)).mtimeMs).toBe(oldTime.getTime());
    } finally {
      await fs.rm(outputRoot, { recursive: true, force: true });
    }
  });
});
