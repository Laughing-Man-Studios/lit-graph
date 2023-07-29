import { AXIS_TYPE } from './constants';
export declare type Axis<T, U> = {
    x: T;
    y: U;
};
export declare type NUM_AXIS_TYPE = Exclude<AXIS_TYPE, AXIS_TYPE.STRING>;
export declare type AxisMeta<T extends AXIS_TYPE> = T extends AXIS_TYPE.STRING ? Array<string> : {
    begin: number;
    end: number;
    interval: number;
    type: T;
};
export declare type GraphMeta = Axis<AxisMeta<AXIS_TYPE>, AxisMeta<AXIS_TYPE>>;
export declare type AxisType = number | string;
export declare type PlotData = Array<Axis<AxisType, AxisType>>;
//# sourceMappingURL=types.d.ts.map