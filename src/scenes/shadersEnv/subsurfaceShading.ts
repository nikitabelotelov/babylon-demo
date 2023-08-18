import { Effect, Scene, ShaderMaterial, Texture, Vector3 } from "@babylonjs/core";
import { getFullShaderName, SHADER_NAMES } from "./shaderNames";

export function initSubsurfaceShader() {
    Effect.ShadersStore[getFullShaderName("subsurfaceShading", "vertex")] = "precision highp float;\r\n" +
    "// Attributes\r\n" +
    "attribute vec3 position;\r\n" +
    "attribute vec3 normal;\r\n" +
    "attribute vec2 uv;\r\n" +

    "// Uniforms\r\n" +
    "uniform mat4 worldViewProjection;\r\n" +

    "// Varying\r\n" +
    "varying vec3 vPosition;\r\n" +
    "varying vec3 vNormal;\r\n" +
    "varying vec2 vUV;\r\n" +

    "void main(void) {\r\n" +
    "    vec4 outPosition = worldViewProjection * vec4(position, 1.0);\r\n" +
    "    gl_Position = outPosition;\r\n" +
    "    \r\n" +
    "    vUV = uv;\r\n" +
    "    vPosition = position;\r\n" +
    "    vNormal = normal;\r\n" +
    "}\r\n";

    Effect.ShadersStore[getFullShaderName("subsurfaceShading", "fragment")] = "precision highp float;\r\n"+
    "\r\n"+
    "// Varying\r\n"+
    "varying vec3 vPosition;\r\n"+
    "varying vec3 vNormal;\r\n"+
    "varying vec2 vUV;\r\n"+
    "\r\n"+
    "// Uniforms\r\n"+
    "uniform mat4 world;\r\n"+
    "\r\n"+
    "// Refs\r\n"+
    "uniform vec3 cameraPosition;\r\n"+
    "uniform sampler2D textureSampler;\r\n"+
    "\r\n"+
    "void main(void) {\r\n"+
    "    vec3 vLightPosition = vec3(100,-20,-10);\r\n"+
    "    \r\n"+
    "    // World values\r\n"+
    "    vec3 vPositionW = vec3(world * vec4(vPosition, 1.0));\r\n"+
    "    vec3 vNormalW = normalize(vec3(world * vec4(vNormal, 0.0)));\r\n"+
    "    vec3 viewDirectionW = normalize(cameraPosition - vPositionW);\r\n"+
    "    \r\n"+
    "    // Light\r\n"+
    "    vec3 lightVectorW = normalize(vLightPosition - vPositionW);\r\n"+
    "    vec3 color = vec3(1., 0., 0.);\r\n"+
    "    float thickness = pow((1.0 - texture2D(textureSampler, vUV).r) * 1.8, 2.);\r\n"+
    "    \r\n"+
    "    // diffuse\r\n"+
    "    float ndl = max(0., dot(vNormalW, lightVectorW));\r\n"+
    "    \r\n"+
    "    // float subsurface2 = clamp(dot(-lightVectorW, normalize(viewDirectionW + vNormalW * 1.)) * thickness, 0., 0.5);\r\n"+
    "    float subsurface2 = clamp(dot(-lightVectorW, normalize(viewDirectionW * 0.8 + vNormalW)) * thickness, 0., 0.5);\r\n"+
    "    \r\n"+
    "    // Specular\r\n"+
    "    vec3 angleW = normalize(viewDirectionW + lightVectorW);\r\n"+
    "    float specComp = max(0., dot(vNormalW, angleW));\r\n"+
    "    specComp = pow(specComp, 64.) * 0.2;\r\n"+
    "    \r\n"+
    "    gl_FragColor = vec4(color * (ndl + subsurface2) + vec3(specComp), 1.);\r\n"+
    "}\r\n";

}

export function getSubsurfaceMaterial(scene: Scene, cameraPosition: Vector3, texture: Texture) {
    const shaderMaterial = new ShaderMaterial("shader", scene, {
        vertex: SHADER_NAMES.subsurfaceShading,
        fragment: SHADER_NAMES.subsurfaceShading,
    },
        {
            attributes: ["position", "normal", "uv"],
            uniforms: ["world", "worldView", "worldViewProjection", "view", "projection", "cameraPosition"],
            samplers: [ "textureSampler" ]
        });
    shaderMaterial.setFloat("time", 0);
    shaderMaterial.setVector3("cameraPosition", cameraPosition);
    shaderMaterial.setTexture("textureSampler", texture);
    shaderMaterial.backFaceCulling = false;
    return shaderMaterial;
}