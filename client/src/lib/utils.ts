import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts a 24-hour time string (HH:MM) to 12-hour format (HH:MM am/pm).
 * @param time24hr The time string in 24-hour format (e.g., "14:30", "09:05").
 * @returns The time string in 12-hour format (e.g., "02:30 pm", "09:05 am").
 */
export function formatTime12hr(time24hr: string): string {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time24hr)) {
        console.warn("Invalid time format provided. Expected HH:MM.");
        return time24hr; 
    }

    const [hoursStr, minutesStr] = time24hr.split(':');
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours === 0 ? 12 : hours; 

    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}:${formattedMinutes} ${ampm}`;
}
