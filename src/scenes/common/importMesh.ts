import { Scene, AbstractMesh, SceneLoader } from "@babylonjs/core"

export async function importMesh(scene: Scene, meshName: string) {
    const promiseRes = new Promise<AbstractMesh[]>(res => {
        SceneLoader.ImportMesh("", "/meshes/", meshName, scene, function (newMeshes) {
            // newMeshes[0].rotationQuaternion = Quaternion.FromEulerAngles(0, 0, 0)
            res(newMeshes)
        })
    })
    return promiseRes
}