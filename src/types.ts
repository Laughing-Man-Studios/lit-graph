export type Axis<T> = { 
    x: T;
    y: T;
}

export type AxisData = { begin: number, end: number, interval: number, type: 'date' | 'number' }
    | Array<String>;
