import { AXIS_TYPE } from './constants';

export type Axis<T, U> = { 
    x: T;
    y: U;
};

export type SingleAxisData<T extends AXIS_TYPE> = 
T extends AXIS_TYPE.STRING ? Array<string> : { 
    begin: number,
    end: number,
    interval: number,
    type: T
};

export type AxisData<T extends AXIS_TYPE, U extends AXIS_TYPE> = 
    Axis<SingleAxisData<T>, SingleAxisData<U>>;

export type AxisType = number | string | Date;

export type PlotData = Array<Axis<AxisType, AxisType>>;
