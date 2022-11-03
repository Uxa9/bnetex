import classNames from 'classnames';
import styles from './skeleton.module.scss';

interface SkeletonProps {
    height: string;
    width?: string;
    type?: 'line' | 'square' | 'circle' | 'input' | 'button';
}

interface InlineStyle {
    width?: string;
    height?: string;
}

const Skeleton = ({height, width = '100%', type = 'line'}: SkeletonProps) => {

    if (type === 'square' || type === 'circle') width = height;

    const inlineStyle: InlineStyle = {
        width: width,
    };

    if(type !== 'input' && type !== 'button') inlineStyle.height = height;

    return(
        <div 
            className={classNames(
                styles['skeleton'],
                styles[`skeleton--${type}`]
            )} 
            style={inlineStyle}
        />
    );
};

export default Skeleton;
