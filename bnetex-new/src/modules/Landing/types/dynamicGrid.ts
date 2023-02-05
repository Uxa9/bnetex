export type DynamicGridAnimation = {
    columnAnimation: Keyframe[];
    dotAnimation: Keyframe[];
}

export type ColumnAnimationProperties = {
    waveIteration: number;
    totalAnimationTime: number;
    columnIterationDelay: number;
}

export type DynamicGridCellDimensions = {
    width: number;
    height: number;
}
