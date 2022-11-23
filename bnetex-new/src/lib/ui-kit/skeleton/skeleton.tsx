import clsx from 'clsx';
import styles from './skeleton.module.scss';

interface SkeletonProps {
    height: string;
    width?: string;
    type?: 'line' | 'square' | 'circle' | 'input' | 'button';
    className?: string;
}

interface InlineStyle {
    width?: string;
    height?: string;
}

const Skeleton = ({height, width = '100%', type = 'line', className}: SkeletonProps) => {

    if (type === 'square' || type === 'circle') width = height;

    const inlineStyle: InlineStyle = {
        width: width,
    };

    if(type !== 'input' && type !== 'button') inlineStyle.height = height;

    return(
        <div 
            className={clsx(
                styles['skeleton'],
                styles[`skeleton--${type}`],
                className,
            )} 
            style={inlineStyle}
        />
    );
};

export default Skeleton;
