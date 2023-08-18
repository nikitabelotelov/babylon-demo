import { AbstractMesh, PhysicsImpostor, Scene, Vector3 } from "@babylonjs/core";
import { importMesh } from "../../common/importMesh";

let cachedMesh: AbstractMesh[] | null = null;
console.log(cachedMesh);

export async function createStand(position: Vector3, scene: Scene) {
    if (!cachedMesh) {
        cachedMesh = await importMesh(scene, "stand.glb");
        cachedMesh[1].isPickable = false;
        cachedMesh[0].physicsImpostor = new PhysicsImpostor(
            cachedMesh[0],
            PhysicsImpostor.MeshImpostor,
            { mass: 0, friction: 0, restitution: 0.3 }
        );
        cachedMesh[0].position.addInPlace(position);
        return cachedMesh;
    } else {
        const standMesh = cachedMesh[0].clone("Stand2", null);
        if (standMesh) {
            standMesh.isPickable = false;
            standMesh.position = position;
        }
        return standMesh;
    }
}
