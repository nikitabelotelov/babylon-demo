import { initCellShadingShader } from "./cellShading";
import { initSubsurfaceShader } from "./subsurfaceShading";

export function initShaders() {
    initCellShadingShader()
    initSubsurfaceShader()
}