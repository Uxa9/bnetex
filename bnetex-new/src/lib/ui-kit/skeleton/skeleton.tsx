import classNames from 'classnames';
import styles from './skeleton.module.scss';

interface SkeletonProps {
    height: string;
    width?: string;
    type?: 'line' | 'square' | 'circle';
}

const Skeleton = ({height, width = '100%', type = 'line'}: SkeletonProps) => {

    if(type !== 'line') width = height;

    return(
        <div 
            className={classNames(
                styles['skeleton'],
                styles[`skeleton--${type}`]
            )} 
            style={{
                height: height,
                width: width,
            }}
        />
    );
};

export default Skeleton;
