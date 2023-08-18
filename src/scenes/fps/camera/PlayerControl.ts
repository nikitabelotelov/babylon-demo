import { Scene, Mesh, FreeCamera, Vector3, Space, Quaternion } from "@babylonjs/core";
import { KeyboardController } from "./KeyboardController";

export function initControl(camera: FreeCamera, hero: Mesh) {
    const scene = camera.getScene()
    const inputController = new KeyboardController(scene, {
        forward: 'KeyW',
        backward: 'KeyS',
        left: 'KeyA',
        right: 'KeyD',
        jump: 'Space'
    })
    scene.registerBeforeRender(() => {
        camera.position.x = hero.position.x;
        camera.position.y = hero.position.y + 16.0;
        camera.position.z = hero.position.z;

        // hero.rotate(new Vector3(0, 1, 0), camera.rotation.y - hero.absoluteRotationQuaternion.toEulerAngles().y, Space.WORLD)
        hero.rotation = new Vector3(0, camera.rotation.y, 0)

        var forward = camera.getTarget().subtract(camera.position).normalize();
        forward.y = 0;
        var right = Vector3.Cross(forward, camera.upVector).normalize();
        right.y = 0;

        const input = inputController.getInput()
        if(hero.physicsImpostor) {
            const originVelocity = hero.physicsImpostor.getLinearVelocity() || Vector3.Zero()
            const newVelocity = originVelocity.clone()
            var move = (forward.scale(input.move.z)).subtract((right.scale(input.move.x))).add(camera.upVector.scale(input.move.y));
            if (input.needJump) {
                newVelocity.y = 10
            }
            newVelocity.x = move.x * 10
            newVelocity.z = move.z * 10
            hero.physicsImpostor?.setLinearVelocity(newVelocity)
        }
    })

}