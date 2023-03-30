import { AXIS, AXIS_TYPE } from './constants';

export type Axis<T> = { 
    x: T;
    y: T;
}

export type AxisData<T extends AXIS_TYPE> = 
T extends AXIS_TYPE.STRING ? Array<string> : { 
    begin: number,
    end: number,
    interval: number,
    type: T
};

type SingleAxisCoords = {
    START: number;
    END: number;
}

export type AxisCoords = {
    [AXIS.X]: SingleAxisCoords;
    [AXIS.Y]: SingleAxisCoords;
}
