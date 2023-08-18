export const SHADER_NAMES = {
    cellShading: "cellShading",
    subsurfaceShading: "subsurfaceShading"
}
export type SHADER_NAMES_TYPE = typeof SHADER_NAMES
export function getFullShaderName(name: keyof SHADER_NAMES_TYPE, type: 'vertex' | 'fragment') {
    return name + (type === 'vertex' ? 'VertexShader' : 'FragmentShader');
}