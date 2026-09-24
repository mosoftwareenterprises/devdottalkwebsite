---
name: friends-event-copy
description: Use when creating a FRIENDS-style event title and short promotional overview from one or more technical talk descriptions
---

# FRIENDS Event Copy

Turn supplied session descriptions into concise event copy with the rhythm of a FRIENDS episode title.

## Output contract

Return exactly:

**Event title:** *The One With/Where [specific shared theme or situation]*

**Overview:** One short paragraph, usually 2-4 sentences.

## Method

1. Extract the strongest concrete subject from each session: technology, problem, approach, or human story.
2. Find one honest bridge between the sessions. Prefer a shared idea such as architecture, learning, failure, systems, or practical problem-solving over simply listing technologies.
3. Write a title beginning with either `The One With` or `The One Where`, whichever suits the wording better, and include a memorable detail from both talks where possible. Keep it readable and avoid cramming in every tool name.
4. Write a short paragraph that says what attendees will hear and why it is useful or interesting.
5. Preserve named technologies and concepts accurately when they matter: for example, Flutter, setState, Provider, domain-driven design, or Conway's law.
6. Keep people anonymous in the event copy. Do not include speaker names, employers, biographies, or personal details in the title or overview unless the user explicitly asks for them.
7. Use only information present in the supplied descriptions and speaker details. Do not invent outcomes, demonstrations, claims, or speaker expertise.

## Tone

- Warm, witty, and lightly playful, like a FRIENDS episode title.
- Clear enough for an event listing; do not imitate dialogue, character voices, catchphrases, or copyrighted script wording.
- Promotional but specific. Avoid generic claims such as “something for everyone.”
- Use British spelling when the source or project uses it.

## Missing detail

If a session has only a speaker bio and no talk subject, describe the contribution generally without naming the speaker, and do not infer the talk's technical content. If the missing detail is essential to a useful overview, ask for the session title or description instead of guessing.

## Quality check

Before responding, confirm:

- The title starts with either `The One With` or `The One Where`.
- Both sessions are represented in the title or overview.
- No person's name or identifying biography detail appears in the title or overview.
- The overview is one paragraph and short enough for an event page.
- No unsupported claim or invented detail was added.
- The output contains only the requested title and overview.
