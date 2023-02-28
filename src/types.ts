import { AXIS_TYPE } from './constants';

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
