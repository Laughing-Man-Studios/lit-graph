export var AXIS_TYPE;
(function (AXIS_TYPE) {
    AXIS_TYPE["DATE"] = "date";
    AXIS_TYPE["NUMBER"] = "number";
    AXIS_TYPE["STRING"] = "string";
})(AXIS_TYPE || (AXIS_TYPE = {}));
export var AXIS;
(function (AXIS) {
    AXIS["X"] = "x";
    AXIS["Y"] = "y";
})(AXIS || (AXIS = {}));
export const GRAPH = {
    [AXIS.X]: {
        START: 0,
        END: 150
    },
    [AXIS.Y]: {
        START: 0,
        END: 150
    }
};
//# sourceMappingURL=constants.js.map