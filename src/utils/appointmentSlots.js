
export const WORKING_HOURS = [
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
];

export function getAvailableSlots(doctorId, date) {
  if (!doctorId || !date) return [];

  const now = new Date();

  return WORKING_HOURS.filter((time) => {
    const appointmentDate = new Date(`${date}T${time}:00`);

    if (appointmentDate <= now) return false;

    const bookingKey =
      `medibook-booking-${date}-${doctorId}-${time}`;

    return !localStorage.getItem(bookingKey);
  });
}
