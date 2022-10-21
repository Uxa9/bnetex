import { useEffect, useRef, useState } from 'react';

export interface DynamicImgProps {
    // путь относительно assets/images
    path: string;
    className?: string;
    alt?: string;
    notLazy?: boolean;
}

export function DynamicImg (props: DynamicImgProps) {
    
    const [isLoading, setIsLoading] = useState(true);
    const imgRef = useRef<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        import(`assets/images/${props.path}`)
            .then((item) => {
                imgRef.current = item.default;
            })
            .finally(() => setIsLoading(false));
    }, [props.path]);

    if (isLoading)
        return <div className={'img-loader--loading'}></div>;

    return (
        imgRef.current ?
            <img
                loading={props.notLazy ? undefined : 'lazy'}
                src={imgRef.current}
                className={props.className}
                alt={props.alt}
            /> 
            :
            <></>
    );
}
