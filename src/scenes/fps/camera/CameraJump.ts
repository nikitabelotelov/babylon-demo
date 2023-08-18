import { Camera, FreeCamera, ICameraInput, KeyboardEventTypes, KeyboardInfo, Nullable, Observer, Animation, CircleEase, EasingFunction } from "@babylonjs/core";

export class CameraJump<T extends Camera> implements ICameraInput<T> {
    camera: T
    private keyJump: string = ' '
    private keys: string[]
    private jumping = false
    private observer: Nullable<Observer<KeyboardInfo>> = null
    constructor(camera: T) {
        this.camera = camera
        this.keys = [];
    }
    private handleKeyboardInput: (kbInfo: any) => void = (kbInfo) => {
        if (kbInfo.event.key === this.keyJump) {
            if (kbInfo.type === KeyboardEventTypes.KEYUP) {
                this.onKeyUp(kbInfo.event)
            } else {
                this.onKeyDown(kbInfo.event)
            }
        }
    }
    private onKeyDown(evt: any) {
        this.keys.push(evt.key);
    }
    private onKeyUp(evt: any) {
        const index = this.keys.indexOf(evt.key)
        if (index !== -1) {
            this.keys.splice(index, 1);
        }
        this.jumping = false;
    }
    getSimpleName(): string {
        return "CameraJumpInput"
    }
    attachControl(noPreventDefault?: boolean): void {
        const scene = this.camera.getScene()
        this.observer = scene.onKeyboardObservable.add(this.handleKeyboardInput)
    }
    detachControl(): void {
        const scene = this.camera.getScene()
        scene.onKeyboardObservable.remove(this.observer)
        this.keys = [];
    }
    checkInputs() {
        for (var i = 0; i < this.keys.length; i++) {
            var keyCode = this.keys[i];
            if (this.keyJump === keyCode) {
                this.cameraJump();
            }
        }
    }
    cameraJump() {
        if (this.jumping !== true) {
            var cam = this.camera;
            cam.animations = [];
            var a = new Animation("a", "position.y", 60, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);

            // Animation keys
            var keys = [];
            keys.push({frame: 0, value: cam.position.y});
            keys.push({frame: 20, value: cam.position.y + 3});
            keys.push({frame: 40, value: cam.position.y + 6});
            keys.push({frame: 50, value: cam.position.y + 5});
            keys.push({frame: 60, value: cam.position.y});
            a.setKeys(keys);

            var easingFunction = new CircleEase();
            easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
            a.setEasingFunction(easingFunction);

            cam.animations.push(a);
            const scene = this.camera.getScene()
            scene.beginAnimation(cam, 0, 20, false);
            this.jumping = true;
        }
    }
    getClassName(): string {
        return "CameraJumpInput"
    }
}