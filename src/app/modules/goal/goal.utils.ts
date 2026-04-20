export const formatHoursToHHMM = (hours: number) => {
    const totalMinutes = Math.max(0, Math.round(hours * 60));
    const hh = Math.floor(totalMinutes / 60);
    const mm = totalMinutes % 60;

    return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
};
