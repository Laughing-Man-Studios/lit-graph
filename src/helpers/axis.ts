import { Axis, AxisData, Data } from '../types';

function numLength(axisData: Array<number>): number {
    const largestNum = Math.max(...axisData);

    return largestNum / axisData.length;
}

function stringLength(axisData: Array<String>): number {
    return axisData.length;
}

function dateLength(axisData: Array <Date>): number {

}

export function getAxisData(axis: Axis, data: Data): AxisData | null {
    if (data.length < 1) {
        return null;
    }

    return data.map(dataPoint => dataPoint[axis]) as AxisData;
}

export function axisLengths(axisData: AxisData): number | null {
    const firstEntry = axisData[0];
    if (typeof firstEntry === 'number') {
        return numLength(axisData as Array<number>);
    } else if (typeof firstEntry === 'string') {
        return stringLength(axisData as Array<String>);
    } else if ( firstEntry instanceof Date) {
      return dateLength(axisData as Array<Date>);
    }

    return null;
}