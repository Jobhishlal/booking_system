# Global Class Offering Booking System

## Overview

This project is a backend service for a global live-learning platform where teachers conduct online classes for students across different countries and timezones.

The system allows:

* Teachers to create course offerings
* Teachers to add sessions to offerings
* Parents to view available offerings
* Parents to book offerings
* Conflict detection for overlapping sessions
* Timezone-aware scheduling
* Concurrent booking protection

---

## Tech Stack

* Node.js
* TypeScript
* Express.js
* PostgreSQL
* Prisma ORM
* Luxon

---

## Architecture

Route
→ Controller
→ Service
→ Repository
→ Prisma
→ PostgreSQL

### Responsibilities

#### Controllers

Handle HTTP requests and responses.

#### Services

Contain business logic such as:

* Booking validation
* Conflict detection
* Timezone conversion

#### Repositories

Handle database operations using Prisma.

---

## Database Design

### Teacher

* id
* name
* email
* timezone

### Parent

* id
* name
* email
* timezone

### Course

* id
* title
* description

### Offering

* id
* courseId
* teacherId
* title
* price
* status

### Session

* id
* offeringId
* startTime
* endTime

### Booking

* id
* parentId
* offeringId
* bookingTime
* status

---

## Features

### Teacher APIs

#### Create Offering

POST /api/teachers/:teacherId/offerings

#### Add Sessions

POST /api/teachers/:teacherId/offerings/:offeringId/sessions

#### Get Teacher Offerings

GET /api/teachers/:teacherId/offerings

---

### Parent APIs

#### Get Available Offerings

GET /api/parents/:parentId/offerings

#### Book Offering

POST /api/parents/:parentId/bookings

#### Get Bookings

GET /api/parents/:parentId/bookings

---

## Timezone Handling

Teachers create sessions in their local timezone.

Before storing in PostgreSQL:

* Session times are converted to UTC

When a parent views offerings:

* UTC times are converted to the parent's local timezone

This ensures correct scheduling across different countries and timezones.

Implemented using Luxon.

---

## Conflict Detection

Parents book an entire offering.

Before creating a booking:

1. All sessions from the new offering are loaded.
2. Existing booked sessions for the parent are loaded.
3. Sessions are compared for overlaps.

A booking is rejected if any session conflicts with an already booked session.

Example:

Offering A:
10:00 AM – 12:00 PM

Offering B:
10:30 AM – 11:30 AM

Result:
Booking rejected due to overlap.

---

## Concurrency Handling

The booking process uses:

* Prisma Transactions
* Row-level locking (FOR UPDATE)

This prevents:

* Duplicate bookings
* Race conditions
* Invalid simultaneous booking requests

---

## Setup

### Install Dependencies

npm install

### Configure Environment

Create a .env file:

DATABASE_URL="your_postgresql_connection_string"

### Run Migrations

npx prisma migrate dev

### Seed Database

npx ts-node prisma/seed.ts

### Start Server

npm run dev

---

## Author

Jobhish Lal
