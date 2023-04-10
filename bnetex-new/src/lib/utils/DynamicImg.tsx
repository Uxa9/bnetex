import { useEffect, useRef, useState } from 'react';
import { throwError } from './errorThrower';

export interface DynamicImgProps {
    // путь относительно assets/images
    path: string;
    className?: string;
    alt?: string;
    notLazy?: boolean;
    dynamicFormat?: boolean;
}

//toDo: переписать под ссылочную загрузку

export function DynamicImg(props: DynamicImgProps) {

    const { path, className, alt, notLazy, dynamicFormat } = props;

    const [isLoading, setIsLoading] = useState(true);
    const imgRef = useRef<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        evaluateFormat(path)
            .then((item) => {
                imgRef.current = item.default;
            })
            .catch(() => throwError('There has been some kind of DynamicImage error'))
            .finally(() => setIsLoading(false));
    }, [path]);

    const evaluateFormat = (path: string) => {
        const [ mainPath, extension ] = path.split('\.');
        const prefferedFormat = dynamicFormat ? localStorage.getItem('availableImageFormat') : null;

        switch (prefferedFormat ?? extension) {
            case 'png': {
                return import(`../../assets/images/${mainPath}.png`);
            }
            case 'webp': {
                return import(`../../assets/images/${mainPath}.webp`);
            }
            case 'avif': {
                return import(`../../assets/images/${mainPath}.avif`);
            }
            case 'svg': {
                return import(`../../assets/images/${mainPath}.svg`);
            }
            default: {
                return Promise.reject();
            }
        }
    };

    if (isLoading) return <div className={'img-loader--loading'}></div>;

    return imgRef.current ? (
        <img
            loading={notLazy ? undefined : 'lazy'}
            src={imgRef.current}
            className={className}
            alt={alt}
        />
    ) : (
        <></>
    );
}
