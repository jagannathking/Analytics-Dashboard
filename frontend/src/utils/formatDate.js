import { format, parseISO } from 'date-fns';

export const formatDateToReadable = (dateString) => {
    if (!dateString) return '';
    try {
        const date = parseISO(dateString);
        return format(date, 'MMM d, yyyy'); // e.g., Oct 20, 2023
    } catch (error) {
        console.error("Error formatting date:", dateString, error);
        return dateString; // Return original if parsing fails
    }
};

export const formatDateTimeToReadable = (dateString) => {
    if (!dateString) return '';
    try {
        const date = parseISO(dateString);
        return format(date, 'MMM d, yyyy HH:mm'); // e.g., Oct 20, 2023 14:30
    } catch (error) {
        console.error("Error formatting date-time:", dateString, error);
        return dateString;
    }
};

// Add other date formatting utilities as needed