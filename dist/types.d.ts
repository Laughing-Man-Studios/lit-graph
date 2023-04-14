import { AXIS_TYPE } from './constants';
export declare type Axis<T, U> = {
    x: T;
    y: U;
};
export declare type NUM_AXIS_TYPE = Exclude<AXIS_TYPE, AXIS_TYPE.STRING>;
export declare type SingleAxisData<T extends AXIS_TYPE> = T extends AXIS_TYPE.STRING ? Array<string> : {
    begin: number;
    end: number;
    interval: number;
    type: T;
};
export declare type AxisData<T extends AXIS_TYPE, U extends AXIS_TYPE> = Axis<SingleAxisData<T>, SingleAxisData<U>>;
export declare type AxisType = number | string;
export declare type PlotData = Array<Axis<AxisType, AxisType>>;
//# sourceMappingURL=types.d.ts.map