import { AbstractMesh, Vector3 } from "@babylonjs/core";

export function scaleToSize(rootMesh: AbstractMesh, size: number) {
    let radius = Number.MIN_VALUE;
    rootMesh.getChildMeshes().forEach(el => {
        const bound = el.getBoundingInfo()
        if(bound.boundingSphere.radius > radius) {
            radius = bound.boundingSphere.radius
        }
    })
    const coef = size / radius;
    rootMesh.scaling = new Vector3(coef, coef, coef);
}