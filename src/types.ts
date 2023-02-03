export type Axis = 'y' | 'x';

// Different ways the data can look like
type StrStr = {x: String, y: String};
type StrNum = {x: String, y: number};
type StrDate = {x: String, y: Date};
type DateStr = {x: Date, y: String};
type DateNum = {x: Date, y: number};
type DateDate = {x: Date, y: Date};
type NumStr = {x: number, y: String};
type NumNum = {x: number, y: number};
type NumDate = {x: number, y: Date};

export type Data = Array<StrStr> |
    Array<StrNum> |
    Array<StrDate> |
    Array<DateStr> |
    Array<DateNum> |
    Array<DateDate> |
    Array<NumStr> |
    Array<NumNum> |
    Array<NumDate>; 

export type AxisData = Array<String> |
    Array<number> |
    Array<Date>;

export type AxisLengths = {
    y: number;
    x: number;
}

