export enum AXIS_TYPE {
    DATE = 'date',
    NUMBER = 'number',
    STRING = 'string',
}

export enum AXIS {
    X = 'x',
    Y = 'y',
}

export const GRAPH = {
    [AXIS.X]: {
        START: 0,
        END: 150,
    },
    [AXIS.Y]: {
        START: 0,
        END: 150,
    },
};

export const AXIS_LABEL_LIMIT = {[AXIS_TYPE.NUMBER]: 10, [AXIS_TYPE.DATE]: 8};
export const LINE_WIDTH = 0.5;
