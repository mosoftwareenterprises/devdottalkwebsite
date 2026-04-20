---
layout: layout
title: "{dev.talk} - May 2026"
description: "Event details for {dev.talk} May 2026 - The One with the Cybersecurity hack"
includeBlueskyPosts: true
hideNextEventBanner: true
hideMainLogo: true
templateEngineOverride: njk,md
permalink: 2026-may-location-info.html
showVenueSection: false
---

{% from "event-overview.njk" import eventOverview %}
{% from "event-details.njk" import eventDate, eventTitle, eventVenueName, floatingVenueLink %}
{% from "locationMapAndOverlay.njk" import locationMapAndOverlay %}
{% from "speaker-session.njk" import speakerSession %}

{% set mayEvent = events.findById(17) %}

{% if showVenueSection %}
{{ floatingVenueLink(mayEvent) }}
{% endif %}

<a href="/"><img alt="The devdottalk logo" src="/images/2026/may/Hero image - May 2026.png" loading="lazy" class="center" style="width:100%"></a>

## {{ eventTitle(mayEvent) }}

Hi there,

{{ eventOverview(17, events.all) }}

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

**Date:** {{ eventDate(mayEvent) }}

**Time:**

- Doors open: 6:50 PM
- Event starts: 7:00 PM
- Event ends: 9:00 PM

**Location:** Bournemouth University, Talbot Campus

{% if showVenueSection %}

## Venue

<section class="venue-section">

<p><strong>🏢 {{ eventVenueName(mayEvent) }}</strong></p>

Bournemouth University, Talbot Campus, Fern Barrow, Poole, Dorset, BH12 5BB

</section>

### Maps & Directions

- 🅿️ **If driving, head to the visitors car park:** [Parking Location](https://maps.app.goo.gl/Sx6j1kpMzQjpCWCg8)  (Parking marked with a **P** pin on the campus map below)
- 🎥 **Watch the video showing how to get from the car park to Kimmeridge house:** [Car park to Kimmeridge house Video](https://youtu.be/fYq5pReMZWs)
- 📍 **Navigate to Kimmeridge House entrance:** [Google Maps pin for Room K101](https://maps.app.goo.gl/CA4HfSixgjCeSfjJ9) or [what3words](https://w3w.co/orange.narrow.crush)  (Kimmeridge House marked with a **KH** pin on campus map below)
- More directions on the [BU website](https://www.bournemouth.ac.uk/about/contact-us/directions-maps/directions-our-talbot-campus) & official [Talbot Campus map](https://www.bournemouth.ac.uk/sites/default/files/asset/document/talbot-campus-map-jan2024.pdf)
{% set mapPins = [
  {
    left: "64%",
    top: "53%",
    text: "P",
    textX: 13.5,
    textY: 19,
    fontSize: 16.3,
    color: "#6315ca",
    ariaLabel: "Visitors Car Park"
  },
  {
    left: "39.2%",
    top: "21.5%",
    text: "CY",
    textX: 13,
    textY: 16.5,
    fontSize: 11.9,
    color: "#2980b9",
    ariaLabel: "Courtyard"
  },
  {
    left: "35.5%",
    top: "14.5%",
    text: "KH",
    textX: 13,
    textY: 16.5,
    fontSize: 11.9,
    color: "#c0392b",
    ariaLabel: "Kimmeridge House – Room K101"
  },
  {
    left: "4%",
    top: "20%",
    text: "BS",
    textX: 13.5,
    textY: 19,
    fontSize: 11.3,
    color: "#2753b4",
    ariaLabel: "Bus Stop"
  }
] %}
{{ locationMapAndOverlay("/images/talbotcampus.svg", mapPins) }}

**Building Entrance:** Kimmeridge House has one entrance, accessed via the courtyard in the middle of campus **(CY pin on Campus map)**. The room is on the first floor — take the stairs or lift, then turn left from the stairs or right from the lift.

**Accessibility:** Flat entrance at ground level with lift access to the first floor.

#### Travel Options

- **Bus:** Drops off at the main entrance on Fern Barrow **(BS pin on the campus map above)**
- **Train:** Nearest station is Bournemouth Station (~45 min walk). Taxi or bus from station takes 15 mins.
- **Bike:** Bike racks available on campus.
- **Parking:** Free during the event. Check signage when parking: [Google Maps location](https://maps.app.goo.gl/Sx6j1kpMzQjpCWCg8)

{% endif %}

---

## Speakers

{{ speakerSession(36, sessions.allEvents) }}

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
