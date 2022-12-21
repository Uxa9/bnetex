import { differenceInHours } from 'date-fns';
import noun from 'plural-ru';

export const calculateElapsedTime = (date: Date) => {
    const totalElapsedHours = differenceInHours(new Date(), date);
    const elapsedDays = Math.floor(totalElapsedHours / 24);
    const elapsedHours = totalElapsedHours % 24;

    const elapsedDaysString = elapsedDays ?
        `${elapsedDays} ${noun(elapsedDays, 'день', 'дня', 'дней')}` :
        '';
    const elapsedHoursString = `${elapsedHours} ${noun(elapsedHours, 'час', 'часа', 'часов')}`;

    return `${elapsedDaysString} ${elapsedHoursString}`;
};
