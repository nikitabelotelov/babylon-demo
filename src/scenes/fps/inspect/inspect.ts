import { Camera, FreeCamera, KeyboardEventTypes, Mesh, Quaternion, Scene, Space, Vector3 } from "@babylonjs/core";
import { getTopParent } from "./getTopParent";

export function initInspectMode(scene: Scene, camera: Camera, controller: InspectController) {
    let dragging = false
    scene.onPointerPick = (e, info) => {
        if (!dragging && info.pickedMesh) {
            const top = getTopParent(info.pickedMesh);
            if (top !== controller.getInspected() && (top as Mesh).isPickable) {
                controller.inspect(top as Mesh)
            }
        }
    }
    scene.onPointerDown = (e, info) => {
        if (controller.getInspected()) {
            dragging = true
            camera.inputs.attached.mouse.detachControl()
        }
    }
    scene.onPointerUp = () => {
        if (dragging) {
            dragging = false
            camera.inputs.attached.mouse.attachControl()
        }
    }
    scene.onPointerMove = (e, info) => {
        if (dragging) {
            controller.rotate(e.movementX / 180, e.movementY / 180)
        }
    }

    scene.onKeyboardObservable.add((kbInfo) => {
        if (kbInfo.type === KeyboardEventTypes.KEYDOWN && kbInfo.event.code === 'Escape') {
            controller.stopInspecting()
            dragging = false
        }
    })
}

export class InspectController {
    private inspected: null | Mesh = null
    private camera: FreeCamera
    private oldPosition: Vector3 | null = null
    private oldRotation: Quaternion | null = null
    private oldScaling: Vector3 | null = null
    constructor(playerCamera: FreeCamera) {
        this.camera = playerCamera
    }

    public getInspected() {
        return this.inspected
    }

    public inspect(mesh: Mesh) {
        this.inspected = mesh
        this.oldPosition = mesh.position.clone()
        this.oldRotation = mesh.rotationQuaternion?.clone() || null
        this.oldScaling = mesh.scaling.clone()
        const cameraDir = this.camera.getForwardRay().direction
        const cameraPos = this.camera.position
        const cameraRotation = this.camera.absoluteRotation
        const newPos = cameraPos.add(cameraDir.multiplyByFloats(4, 4, 4).add(new Vector3(0, -1, 0)))
        mesh.position = newPos
        mesh.rotationQuaternion = Quaternion.FromEulerAngles(0, -cameraRotation.toEulerAngles().y - Math.PI / 2, 0)
    }

    public stopInspecting() {
        if (this.inspected && this.oldRotation && this.oldPosition && this.oldScaling) {
            this.inspected.rotationQuaternion = this.oldRotation
            this.inspected.position = this.oldPosition
        }
        this.inspected = null
    }

    public rotate(x: number, y: number) {
        if (this.inspected) {
            const cameraDir = this.camera.getForwardRay().direction.clone()
            cameraDir.y = 0
            const quatX = Quaternion.FromEulerAngles(0, Math.PI / 2, 0)
            const vecX = Vector3.Zero()
            cameraDir.rotateByQuaternionToRef(quatX, vecX)
            const quatY = Quaternion.RotationAxis(vecX, -Math.PI / 2)
            const vecY = Vector3.Zero()
            cameraDir.rotateByQuaternionToRef(quatY, vecY)

            this.inspected.rotate(vecX, y, Space.WORLD)
            this.inspected.rotate(vecY, x, Space.WORLD)
        }
    }
}