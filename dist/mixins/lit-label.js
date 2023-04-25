import { css, svg } from 'lit';
export const LitLabelMixin = (superClass) => {
    class LitLabelClass extends superClass {
        renderLabels(axisLabels) {
            const { x, y } = axisLabels;
            return (svg `
                <g id="labels">
                    <text class="x" x="50%" y="100%">${x}</text>
                    <text class="y" y="50%">${y}</text>
                <g>
            `);
        }
    }
    LitLabelClass.styles = (css ` 
            #labels text.y {
                transform-box: fill-box;
	            transform: rotate(-90deg);
	            transform-origin: center;
            }
        `);
    return LitLabelClass;
};
//# sourceMappingURL=lit-label.js.map