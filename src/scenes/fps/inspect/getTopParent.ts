import { Node } from "@babylonjs/core";

export function getTopParent(mesh: Node) {
    let current: Node = mesh
    while(current.parent) {
        current = current.parent
    }
    return current
}