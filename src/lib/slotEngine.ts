// ==========================================
// Slot Generation Engine
// ==========================================
import {
  type TimeSlot,
  type Professional,
  type BookingService,
  type Booking,
  getDayName,
  holidays,
} from "@/data/bookingData";

function timeToMin(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function minToTime(m: number): string {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

function isOverlapping(
  slotStart: number,
  slotEnd: number,
  blockStart: number,
  blockEnd: number
): boolean {
  return slotStart < blockEnd && slotEnd > blockStart;
}

/**
 * Generate available time slots for a single professional on a given date.
 */
export function generateSlotsForProfessional(
  professional: Professional,
  service: BookingService,
  date: Date,
  bookings: Booking[],
  now: Date = new Date()
): TimeSlot[] {
  const dateStr = date.toISOString().split("T")[0];
  const dayName = getDayName(date);
  const isToday = dateStr === now.toISOString().split("T")[0];
  const currentMinutes = isToday ? now.getHours() * 60 + now.getMinutes() : -1;

  // Check blocked dates & holidays
  if (
    professional.blockedDates.includes(dateStr) ||
    holidays.includes(dateStr)
  ) {
    return [];
  }

  // Find schedule for this day
  const schedule = professional.schedules.find((s) => s.dayOfWeek === dayName);
  if (!schedule) return [];

  const workStart = timeToMin(schedule.startTime);
  const workEnd = timeToMin(schedule.endTime);
  const duration = service.durationMinutes;
  const buffer = professional.bufferMinutes;
  const step = duration + buffer;

  // Get existing bookings for this professional on this date
  const dayBookings = bookings.filter(
    (b) =>
      b.professionalId === professional.id &&
      b.date === dateStr &&
      b.status !== "cancelled"
  );

  const slots: TimeSlot[] = [];
  let cursor = workStart;

  while (cursor + duration <= workEnd) {
    const slotStart = cursor;
    const slotEnd = cursor + duration;

    // Check if slot falls in a break
    const inBreak = schedule.breaks.some((brk) =>
      isOverlapping(slotStart, slotEnd, timeToMin(brk.start), timeToMin(brk.end))
    );

    if (inBreak) {
      // Jump past break
      const breakEnd = Math.max(
        ...schedule.breaks
          .filter((brk) =>
            isOverlapping(slotStart, slotEnd, timeToMin(brk.start), timeToMin(brk.end))
          )
          .map((brk) => timeToMin(brk.end))
      );
      cursor = breakEnd;
      continue;
    }

    // Check if slot conflicts with existing booking (include buffer)
    const conflictsBooking = dayBookings.some((b) => {
      const bStart = timeToMin(b.startTime);
      const bEnd = timeToMin(b.endTime) + buffer;
      return isOverlapping(slotStart, slotEnd, bStart, bEnd);
    });

    // Check if slot is in the past
    const isPast = isToday && slotStart <= currentMinutes;

    const time = minToTime(slotStart);

    if (conflictsBooking) {
      slots.push({ time, status: "occupied", professionalId: professional.id });
    } else if (isPast) {
      slots.push({ time, status: "past", professionalId: professional.id });
    } else {
      slots.push({ time, status: "available", professionalId: professional.id });
    }

    cursor += step;
  }

  return slots;
}

/**
 * Generate merged slots across multiple professionals (Mode B: any available).
 * Returns only the best available slot per time, picking one professional.
 */
export function generateSlotsAnyProfessional(
  pros: Professional[],
  service: BookingService,
  date: Date,
  bookings: Booking[],
  now?: Date
): TimeSlot[] {
  const allSlots = pros.flatMap((p) =>
    generateSlotsForProfessional(p, service, date, bookings, now)
  );

  // Group by time — prefer available over others
  const byTime = new Map<string, TimeSlot>();
  for (const slot of allSlots) {
    const existing = byTime.get(slot.time);
    if (!existing || (existing.status !== "available" && slot.status === "available")) {
      byTime.set(slot.time, slot);
    }
  }

  return Array.from(byTime.values()).sort((a, b) => a.time.localeCompare(b.time));
}

/**
 * Find the next date with availability starting from a given date.
 */
export function findNextAvailableDate(
  professional: Professional | null,
  pros: Professional[],
  service: BookingService,
  startDate: Date,
  bookings: Booking[],
  maxDaysAhead: number = 30
): Date | null {
  const d = new Date(startDate);
  for (let i = 0; i < maxDaysAhead; i++) {
    d.setDate(d.getDate() + 1);
    const slots = professional
      ? generateSlotsForProfessional(professional, service, d, bookings)
      : generateSlotsAnyProfessional(pros, service, d, bookings);
    if (slots.some((s) => s.status === "available")) {
      return new Date(d);
    }
  }
  return null;
}
