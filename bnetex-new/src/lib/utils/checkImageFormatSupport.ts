const avifSrc: string = 'AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';
const webpSrc: string = 'UklGRjIAAABXRUJQVlA4ICYAAACyAgCdASoCAAEALmk0mk0iIiIiIgBoSygABc6zbAAA/v56QAAAAA==';

export type ImageFormat = 'png' | 'webp' | 'avif' | 'jpg' | 'jpeg' | 'svg';

/**
 * Попытаться создать изображение заданного формата (неудачное создание означает отсутствие поддержки формата браузером)
 * @param format
 * @param img
 * @returns
 */
const isFormatSupported = (format: ImageFormat, img: string): Promise<ImageFormat> => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = `data:image/${format};base64,${img}`;
        image.onload = () => resolve(format);
        image.onerror = () => reject();
    });
};

/**
 * Функция проверяет доступны ли форматы изображений avif и webp в браузере пользователя
 * возвращает первый по очереди доступный формат или формат по умолчанию
 * @returns avif | webp | null
 */
export const checkImageFormatSupport = (): Promise<ImageFormat> => {
    return isFormatSupported('avif', avifSrc)
        .catch(() => isFormatSupported('webp', webpSrc))
        .catch(() => Promise.reject());
};
