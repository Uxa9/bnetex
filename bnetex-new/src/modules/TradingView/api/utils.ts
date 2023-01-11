import { ResolutionString } from 'charting_library/charting_library';
import { millisecondsInHour, millisecondsInMinute } from 'date-fns/constants';
import { availableIntervals, PeriodScope } from './types';

/**
 * Возвращает число миллисекунд в интервале из TV
 * @param intervalKey
 * @returns
 */
export const getIntervalDuration = (intervalKey: ResolutionString): number => {
    const interval = availableIntervals[intervalKey];
    if (!interval) throw new Error('Incorrect interval');

    const timeKey: string | undefined = interval.split('').at(-1);
    const timeValue: number = Number(interval.slice(0, -1));

    switch (timeKey) {
        case 'm': {
            return timeValue * millisecondsInMinute;
        }
        case 'h': {
            return timeValue * millisecondsInHour;
        }
        case 'd': {
            return timeValue * millisecondsInHour * 24;
        }
        case 'w': {
            return timeValue * millisecondsInHour * 24 * 7;
        }
        default: {
            return 1;
        }
    }
};

/**
 * Функция разбивает запрошенный интервал времени на несколько интервалов
 * каждый из которых вмещает не более чем maxKlineAmount свечек
 * @param period
 * @param resolution
 * @param maxKlineAmount
 * @returns
 */

export const separateKlineRequestInterval = (
    period: PeriodScope,
    resolution: ResolutionString,
    maxKlineAmount = 500
): PeriodScope[] => {

    const barDuration = getIntervalDuration(resolution);
    const separatedIntervalRequests: PeriodScope[] = [];
    const maxKlineAmountDuration = maxKlineAmount * barDuration;

    let currentIntervalStart = period.from;

    while (currentIntervalStart < period.to) {
        const currentIntervalEnd = currentIntervalStart + maxKlineAmountDuration;

        const requestTimeframe: PeriodScope = {
            from: currentIntervalStart,
            to: currentIntervalEnd > period.to ? period.to : currentIntervalEnd,
        };

        separatedIntervalRequests.push(requestTimeframe);
        currentIntervalStart = currentIntervalStart + maxKlineAmountDuration;
    }

    return separatedIntervalRequests;
};
