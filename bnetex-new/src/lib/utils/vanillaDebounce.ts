export function debounce<T extends any[]>(
    callback: (...args: T) => any,
    timeout: number,
): (...args: T) => void {

    let timer: NodeJS.Timeout;

    return (...args: T) => {
        clearTimeout(timer);
        timer = setTimeout(() => callback(...args), timeout);
    };
}
