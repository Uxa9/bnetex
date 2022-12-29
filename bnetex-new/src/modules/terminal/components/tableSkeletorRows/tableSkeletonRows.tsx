import Skeleton from 'lib/ui-kit/skeleton/skeleton';
import { createDummyArray } from 'lib/utils/createDummyArray';

interface TableSkeletonRowsProps {
    rowCount?: number,
    columnCount: number,
    skeletonClassname?: string,
}

const TableSkeletonRows = ({rowCount = 3, columnCount, skeletonClassname}: TableSkeletonRowsProps) => {
    const rows = createDummyArray(rowCount);
    const columns = createDummyArray(columnCount);

    return(
        <>
            {
                rows.map((_, index) =>
                    <tr key={index}>
                        {
                            columns.map((_, index) =>
                                <td key={index}>
                                    <Skeleton
                                        height={'12px'}
                                        className={skeletonClassname}
                                    />
                                </td>
                            )
                        }
                    </tr>
                )
            }
        </>
    );
};

export default TableSkeletonRows;
