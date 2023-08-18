import { KeyboardEventTypes, Scene, Vector3 } from "@babylonjs/core";

export interface IKeyBindings {
    forward: string
    backward: string
    left: string
    right: string
    jump: string
}

export class KeyboardController {
    keyBindings: IKeyBindings
    z: number
    y: number
    x: number
    needJump: boolean
    constructor(scene: Scene, keyBindings: IKeyBindings) {
        this.z = 0
        this.x = 0
        this.y = 0
        this.needJump = false
        this.keyBindings = keyBindings
        scene.onKeyboardObservable.add((kbInfo) => {
            if (kbInfo.type === KeyboardEventTypes.KEYDOWN) {
                switch (kbInfo.event.code) {
                    case this.keyBindings.backward:
                        this.z = -1
                        break
                    case this.keyBindings.forward:
                        this.z = 1
                        break
                    case this.keyBindings.left:
                        this.x = -1
                        break
                    case this.keyBindings.right:
                        this.x = 1
                        break
                    case this.keyBindings.jump:
                        this.needJump = true
                        break
                }
            } else if (kbInfo.type === KeyboardEventTypes.KEYUP) {
                switch (kbInfo.event.code) {
                    case this.keyBindings.backward:
                        this.z = 0
                        break
                    case this.keyBindings.forward:
                        this.z = 0
                        break
                    case this.keyBindings.left:
                        this.x = 0
                        break
                    case this.keyBindings.right:
                        this.x = 0
                        break
                }
            }
        })
    }
    getInput() {
        const res = {
            move: (new Vector3(this.x, this.y, this.z)).normalize(),
            needJump: this.needJump
        }
        this.needJump = false
        return res
    }
}