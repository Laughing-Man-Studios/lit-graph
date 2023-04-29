import { AXIS_TYPE } from './constants';

export type Axis<T, U> = { 
    x: T;
    y: U;
};

export type NUM_AXIS_TYPE = Exclude<AXIS_TYPE, AXIS_TYPE.STRING>;

export type AxisMeta<T extends AXIS_TYPE> = 
T extends AXIS_TYPE.STRING ? Array<string> : { 
    begin: number,
    end: number,
    interval: number,
    type: T
};

export type GraphMeta = 
    Axis<AxisMeta<AXIS_TYPE>, AxisMeta<AXIS_TYPE>>;

export type AxisType = number | string;

export type PlotData = Array<Axis<AxisType, AxisType>>;
