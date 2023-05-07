import { css, svg } from 'lit';
export const LitLabelMixin = (superClass) => {
    var _a;
    class LitLabelClass extends superClass {
        renderLabels(labels, meta) {
            const { x: xLabel, y: yLabel } = labels;
            const { x: xPos, y: yPos } = meta;
            return svg `
                <g id="labels">
                    <text class="x" x="50%" y="${xPos}">${xLabel}</text>
                    <text class="y" y="50%" x="${yPos}">${yLabel}</text>
                </g>
            `;
        }
    }
    LitLabelClass.styles = [
        (_a = superClass.styles) !== null && _a !== void 0 ? _a : [],
        css `
                #labels text {
                    transform-box: fill-box;
                    transform-origin: center;
                }
                #labels text.y {
                    transform: translate(-60%, -50%) rotate(-90deg);
                }
                #labels text.x {
                    transform: translate(-50%, 50%);
                }
            `,
    ];
    return LitLabelClass;
};
//# sourceMappingURL=lit-label.js.map