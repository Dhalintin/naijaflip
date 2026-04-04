export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

/**
 * Formats a date (string, Date object, or Firestore Timestamp) to 'yyyy-mm-dd'
 */
export const formatToYYYYMMDD = (dateInput: string | Date | any): string => {
  if (!dateInput) return "";

  try {
    let date: Date;

    // Handle Firestore Timestamp (has .toDate() method)
    if (dateInput?.toDate && typeof dateInput.toDate === "function") {
      date = dateInput.toDate();
    }
    // Handle string or other values
    else {
      date = new Date(dateInput);
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn("Invalid date input:", dateInput);
      return "";
    }

    // Best and simplest way: use toISOString() → always gives yyyy-mm-dd in UTC
    return date.toISOString().split("T")[0];
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};
