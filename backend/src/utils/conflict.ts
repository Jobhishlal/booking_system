
export function isOverlapping(
  newStart: Date,
  newEnd: Date,
  existingStart: Date,
  existingEnd: Date
): boolean {
  return newStart < existingEnd && newEnd > existingStart;
}

export interface SessionTime {
  startTime: Date;
  endTime: Date;
}

/**
 * Checks if any session in the new list overlaps with any session in the existing list.
 * @param newSessions List of new sessions being booked
 * @param existingSessions List of sessions already booked
 * @returns An array of overlapping session pairs or null if no conflict
 */
export function findSessionConflict(
  newSessions: SessionTime[],
  existingSessions: SessionTime[]
): { newSession: SessionTime; existingSession: SessionTime } | null {
  for (const newSession of newSessions) {
    for (const existingSession of existingSessions) {
      if (
        isOverlapping(
          newSession.startTime,
          newSession.endTime,
          existingSession.startTime,
          existingSession.endTime
        )
      ) {
        return {
          newSession,
          existingSession,
        };
      }
    }
  }
  return null;
}
