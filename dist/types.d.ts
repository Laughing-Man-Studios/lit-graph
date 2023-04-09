import { AXIS, AXIS_TYPE } from './constants';
export declare type Axis<T> = {
    x: T;
    y: T;
};
export declare type AxisData<T extends AXIS_TYPE> = T extends AXIS_TYPE.STRING ? Array<string> : {
    begin: number;
    end: number;
    interval: number;
    type: T;
};
declare type SingleAxisCoords = {
    START: number;
    END: number;
};
export declare type AxisCoords = {
    [AXIS.X]: SingleAxisCoords;
    [AXIS.Y]: SingleAxisCoords;
};
export {};
//# sourceMappingURL=types.d.ts.map