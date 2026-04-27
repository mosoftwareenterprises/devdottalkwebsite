---
layout: layout
title: "{dev.talk} - June 2026"
description: "Event details for {dev.talk} June 2026 - The One with the Cybersecurity hack"
includeBlueskyPosts: true
hideNextEventBanner: true
hideMainLogo: true
templateEngineOverride: njk,md
permalink: 2026-june-location-info.html
showVenueSection: true
eventId: 18
---

{% from "event-overview.njk" import eventOverview %}
{% from "event-details.njk" import eventDate, eventTitle, floatingVenueLink %}
{% from "speaker-session.njk" import speakerSession %}
{% from "venue-details.njk" import renderVenueDetails %}

{% set currentEvent = events.findById(eventId) %}
{% set eventVenue = eventVenues.findByEvent(currentEvent) %}

{% if showVenueSection %}
{{ floatingVenueLink(currentEvent) }}
{% endif %}

<a href="/"><img alt="The devdottalk logo" src="/images/2026/june/Hero image - June 2026.png" loading="lazy" class="center" style="width:100%"></a>

## {{ eventTitle(currentEvent) }}

Hi there,

{{ eventOverview(eventId, events.all) }}

Thank you for being part of our amazing community of software engineers and tech enthusiasts.

**Quick Reminder:** Organising these events takes a lot of time and effort from our dedicated volunteers. If your plans change and you can't make it, please cancel your [ticket](/tickets) via the ticketing app or drop us an email at [contactus@devdottalk.uk](mailto:contactus@devdottalk.uk). This helps us manage the event better and allows others to attend.

---

{% if not showVenueSection %}
<section class="venue-details-coming-soon">

**📍 Venue Details Coming Soon!**

We'll reveal the exact location on campus a few days before the event. If you get a ticket, you will be notified of the location on the day, as well as links to maps too.
This helps us to manage capacity more effectively.

</section>
{% endif %}

## Event Details

**Date:** {{ eventDate(currentEvent) }}

**Time:**

- Doors open: 6:50 PM
- Event starts: 7:00 PM
- Event ends: 9:00 PM

**Location:** Bournemouth University, Talbot Campus

{% if showVenueSection %}

## Venue

{{ renderVenueDetails(eventVenue, currentEvent) }}

{% endif %}

---

## Speakers

{% if currentEvent and currentEvent.sessionIDs and currentEvent.sessionIDs.length > 0 %}
{% for sessionId in currentEvent.sessionIDs %}
{{ speakerSession(sessionId, sessions.allEvents) }}

{% if not loop.last %}
<hr>
{% endif %}
{% endfor %}
{% else %}
Speaker details coming soon.
{% endif %}

---

## What to Expect

We'll have soft drinks and some snacks available to keep you refreshed throughout the evening. If you have any dietary restrictions or allergen concerns, please let our organisers know.

Upon arrival, we'll check your ticket and provide you with a name badge. This is a great opportunity to network with fellow attendees, so don't be shy, introduce yourself.

The night will consist of some software focussed talks (normally 2) interspersed with networking opportunities.

For more on the event format, see our [Attending page](/attending.html) and [FAQs](/faqs.html).

---

## Important Notes

**Photography & Recording:**
Please note that the event will be recorded and photographed. If you prefer not to be included in any photos or videos, kindly inform the camera operator. These materials will be used to promote future events and shared on platforms like YouTube.

---

## We Can't Wait to See You

Thank you for being part of {dev.talk}. We're excited to connect, learn, and grow together as a community. See you soon!

Warm regards,

The {dev.talk} Team
