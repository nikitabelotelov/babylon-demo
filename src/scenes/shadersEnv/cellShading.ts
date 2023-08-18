import { Effect, Scene, ShaderMaterial, Vector3 } from "@babylonjs/core";
import { getFullShaderName, SHADER_NAMES } from "./shaderNames";

export function initCellShadingShader() {
    Effect.ShadersStore[getFullShaderName("cellShading", "vertex")] = "precision highp float;\r\n" +

        "// Attributes\r\n" +
        "attribute vec3 position;\r\n" +
        "attribute vec3 normal;\r\n" +
        "attribute vec2 uv;\r\n" +

        "// Uniforms\r\n" +
        "uniform mat4 world;\r\n" +
        "uniform mat4 worldViewProjection;\r\n" +

        "// Varying\r\n" +
        "varying vec3 vPositionW;\r\n" +
        "varying vec3 vNormalW;\r\n" +
        "varying vec2 vUV;\r\n" +

        "void main(void) {\r\n" +
        "    vec4 outPosition = worldViewProjection * vec4(position, 1.0);\r\n" +
        "    gl_Position = outPosition;\r\n" +
        "    \r\n" +
        "    vPositionW = vec3(world * vec4(position, 1.0));\r\n" +
        "    vNormalW = normalize(vec3(world * vec4(normal, 0.0)));\r\n" +
        "    \r\n" +
        "    vUV = uv;\r\n" +
        "}\r\n";

    Effect.ShadersStore[getFullShaderName("cellShading", "fragment")] = "precision highp float;\r\n" +

        "// Lights\r\n" +
        "varying vec3 vPositionW;\r\n" +
        "varying vec3 vNormalW;\r\n" +
        "varying vec2 vUV;\r\n" +

        "// Refs\r\n" +
        "uniform sampler2D textureSampler;\r\n" +

        "void main(void) {\r\n" +
        "    float ToonThresholds[4];\r\n" +
        "    ToonThresholds[0] = 0.95;\r\n" +
        "    ToonThresholds[1] = 0.5;\r\n" +
        "    ToonThresholds[2] = 0.2;\r\n" +
        "    ToonThresholds[3] = 0.03;\r\n" +
        "    \r\n" +
        "    float ToonBrightnessLevels[5];\r\n" +
        "    ToonBrightnessLevels[0] = 1.0;\r\n" +
        "    ToonBrightnessLevels[1] = 0.8;\r\n" +
        "    ToonBrightnessLevels[2] = 0.6;\r\n" +
        "    ToonBrightnessLevels[3] = 0.35;\r\n" +
        "    ToonBrightnessLevels[4] = 0.2;\r\n" +
        "    \r\n" +
        "    vec3 vLightPosition = vec3(0,20,10);\r\n" +
        "    \r\n" +
        "    // Light\r\n" +
        "    vec3 lightVectorW = normalize(vLightPosition - vPositionW);\r\n" +
        "    \r\n" +
        "    // diffuse\r\n" +
        "    float ndl = max(0., dot(vNormalW, lightVectorW));\r\n" +
        "    \r\n" +
        "    vec3 color = vec3(0.7, 0.7, 0);\r\n" +
        "    \r\n" +
        "    if (ndl > ToonThresholds[0])\r\n" +
        "    {\r\n" +
        "        color *= ToonBrightnessLevels[0];\r\n" +
        "    }\r\n" +
        "    else if (ndl > ToonThresholds[1])\r\n" +
        "    {\r\n" +
        "        color *= ToonBrightnessLevels[1];\r\n" +
        "    }\r\n" +
        "    else if (ndl > ToonThresholds[2])\r\n" +
        "    {\r\n" +
        "        color *= ToonBrightnessLevels[2];\r\n" +
        "    }\r\n" +
        "    else if (ndl > ToonThresholds[3])\r\n" +
        "    {\r\n" +
        "        color *= ToonBrightnessLevels[3];\r\n" +
        "    }\r\n" +
        "    else\r\n" +
        "    {\r\n" +
        "        color *= ToonBrightnessLevels[4];\r\n" +
        "    }\r\n" +
        "    \r\n" +
        "    gl_FragColor = vec4(color, 1.);\r\n" +
        "}\r\n";

}

export function getCellShadingMaterial(scene: Scene) {
    const shaderMaterial = new ShaderMaterial("shader", scene, {
        vertex: SHADER_NAMES.cellShading,
        fragment: SHADER_NAMES.cellShading,
    },
        {
            attributes: ["position", "normal", "uv"],
            uniforms: ["world", "worldView", "worldViewProjection", "view", "projection"]
        });

    shaderMaterial.setFloat("time", 0);
    shaderMaterial.setVector3("cameraPosition", Vector3.Zero());
    shaderMaterial.backFaceCulling = false;
    return shaderMaterial;
}