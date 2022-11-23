import { useEffect, useRef, useState } from 'react';
import { throwError } from './errorThrower';

export interface DynamicImgProps {
    // путь относительно assets/images
    path: string;
    className?: string;
    alt?: string;
    notLazy?: boolean;
}

export function DynamicImg(props: DynamicImgProps) {
    const [isLoading, setIsLoading] = useState(true);
    const imgRef = useRef<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        evaluateFormat(props.path)
            .then((item) => {
                imgRef.current = item.default;
            })
            .catch(() => throwError('There has been some kind of DynamicImage error'))
            .finally(() => setIsLoading(false));
    }, [props.path]);

    const evaluateFormat = (path: string) => {
        const [ mainPath, extension ] = path.split('\.');

        switch (extension) {
            case 'png': {
                return import(`../../assets/images/${mainPath}.png`);
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
            loading={props.notLazy ? undefined : 'lazy'}
            src={imgRef.current}
            className={props.className}
            alt={props.alt}
        />
    ) : (
        <></>
    );
}
