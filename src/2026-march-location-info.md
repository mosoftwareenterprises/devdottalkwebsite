---
layout: layout
title: "{dev.talk} - March 2026"
description: "Event details for {dev.talk} March 2026 - The One Where JARVIS Fits in Your Pocket and the IC Grows Up"
includeBlueskyPosts: true
hideNextEventBanner: true
hideMainLogo: false
templateEngineOverride: njk,md
permalink: 2026-march-location-info.html
showVenueSection: false
---

{% if showVenueSection %}
<a href="#venue" style="position: sticky; top: 0; z-index: 100; background-color: rgb(112, 136, 216); color: white; padding: 12px; text-align: center; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1); display: block; text-decoration: none; cursor: pointer;">
  📍 Room K101, Kimmeridge House | Wed 25th March @ 7:00 PM
</a>
{% endif %}

## {dev.talk} - The One Where JARVIS Fits in Your Pocket and the IC Grows Up

Hi there,

This month we are taking a delve into the world of AI to talk about building an Agentic Mobile OS and also learning how being a manager can make you a better engineer.

Thank you for being part of our amazing community of software engineers and tech enthusiasts.

**Quick Reminder:** Organising these events takes a lot of time and effort from our dedicated volunteers. If your plans change and you can't make it, please cancel your ticket via the ticketing app or drop us an email at [contactus@devdottalk.uk](mailto:contactus@devdottalk.uk).This helps us manage the event better and allows others to attend.

---

{% if not showVenueSection %}
<section style="background-color: #fff3cd; padding: 20px; margin: 20px 0; border-left: 4px solid #ff9800; border-radius: 4px;">

**📍 Venue Details Coming Soon!**

We'll reveal the exact location on campus a few days before the event. If you get a ticket, you will be notified of the location on the day, as well as links to maps too.

</section>
{% endif %}

<section style="background-color: #f9f9f9; padding: 20px; margin: 20px 0; border-left: 4px solid rgb(112, 136, 216); border-radius: 4px;">

## Table of Contents

- [Event Details](#event-details)
{% if showVenueSection %}
- [Venue](#venue)
- [Getting There](#getting-there)
{% else %}
- [🔒 Venue Details Coming Soon](#venue-details-coming-soon)
{% endif %}
- [Speakers](#speakers)
- [What to Expect](#what-to-expect)
- [Important Notes](#important-notes)

</section>

---

## Event Details

**Date:** Wednesday, 25th March 2026

**Time:**

- Doors open: 6:50 PM
- Event starts: 7:00 PM
- Event ends: 9:00 PM

**Location:** Bournemouth University, Talbot Campus

{% if showVenueSection %}

## Venue

<section style="background-color: #e7f3ff; padding: 15px; border-left: 4px solid rgb(112, 136, 216); border-radius: 4px; margin: 15px 0;">

**🏢 Room K101, Kimmeridge House**

Bournemouth University, Fern Barrow, Poole, Dorset, BH12 5BB

</section>

### Getting There

#### Maps & Directions

- [Kimmeridge House](https://www.bournemouth.ac.uk/sites/default/files/asset/document/talbot-campus-map_0.pdf) -marked with its name and the number 16 on this map
- [Parking Location](https://maps.app.goo.gl/Sx6j1kpMzQjpCWCg8) - location of BU visitors car park
- Room K101 location on [Google Maps](https://maps.app.goo.gl/CA4HfSixgjCeSfjJ9) or [what3words](https://w3w.co/orange.narrow.crush)

##### Campus Map

Download: [PDF Version](https://www.bournemouth.ac.uk/sites/default/files/asset/document/talbot-campus-map_0.pdf)

**Building Entrance:**

Kimmeridge House has 1 entrance, and is accessible via the courtyard in the middle of campus.

**Accessibility:**
The room is on the first floor and fully accessible with a flat entrance at the ground floor with a lift to the first floor.

**Room Entrance:**
Located on the first floor, turn left at the top of the stairs, or turn right if exiting the lift.

#### Travel Options

- **Bus:** Drops off at main entrance on Fern Barrow.
- **Train:** Nearest station is Bournemouth Station (~45 min walk). Taxi or bus from station takes 15 mins.
- **Bike:** Bike racks available on campus.
- **Parking:** Free during the event. Check signage when parking: [Google Maps location](https://maps.app.goo.gl/Sx6j1kpMzQjpCWCg8)

{% else %}

## Venue Details Coming Soon

Ticket holders will be sent exact room on campus **shortly before the event** to manage capacity more effectively.

{% endif %}

---

## Speakers

{% from "speaker-session.njk" import speakerSession %}
{{ speakerSession(31, "/images/2026/march/First Speaker image - March 2026.png", sessions.all) }}

---

{{ speakerSession(32, "/images/2026/march/Second Speaker image - March 2026.png", sessions.all) }}

---

## What to Expect

We'll have soft drinks and some snacks available to keep you refreshed throughout the evening. If you have any dietary restrictions or allergen concerns, please let our organisers know.

Upon arrival, we'll check your ticket and provide you with a name badge. This is a great opportunity to network with fellow attendees, so don't be shy, introduce yourself.

The night will consist of some software focussed talks (normally 2) interspersed with networking opportunities.

---

## Important Notes

**Photography & Recording:**
Please note that the event will be recorded and photographed. If you prefer not to be included in any photos or videos, kindly inform the camera operator. These materials will be used to promote future events and shared on platforms like YouTube.

---

## We Can't Wait to See You

Thank you for being part of {dev.talk}. We're excited to connect, learn, and grow together as a community. See you soon!

Warm regards,

The {dev.talk} Team
