import { Engine } from "@babylonjs/core/Engines/engine";
import { DirectionalLight, PointLight, Texture } from "@babylonjs/core";
import { Scene } from "@babylonjs/core/scene";
import '@babylonjs/inspector'
import "@babylonjs/core/Debug/debugLayer";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import "@babylonjs/core/Physics/physicsEngineComponent";

// If you don't need the standard material you will still need to import it since the scene requires it.
import "@babylonjs/core/Materials/standardMaterial";
import { PhysicsImpostor } from "@babylonjs/core/Physics/physicsImpostor";
import { ammoModule, ammoReadyPromise } from "../externals/ammo";
import { CreateSceneClass } from "../createScene";
import { AmmoJSPlugin, Color3, HemisphericLight, MeshBuilder, StandardMaterial, UniversalCamera } from "@babylonjs/core";
import { initControl } from "./fps/camera/PlayerControl";
import { initMultiplayer } from "./multiplayer/initMultiplayer";
import { initInspectMode, InspectController } from "./fps/inspect/inspect";
import { initShaders } from "./shadersEnv/initShaders";
import { scaleToSize } from "./fps/inspect/scaleToSize";
import { getSubsurfaceMaterial } from "./shadersEnv/subsurfaceShading";
import { importMesh } from "./common/importMesh";
import { createStand } from "./fps/museum/stand";

function initDemoBoxes(scene: Scene) {
    //Simple crate
    const boxMaterial = new StandardMaterial('HeroMaterial', scene)
    boxMaterial.diffuseColor = new Color3(0, 1, 1)

    const box = MeshBuilder.CreateBox("crate", { width: 5, height: 1, depth: 5 }, scene);
    box.position = new Vector3(5, 0.5, -10);
    box.material = boxMaterial;
    box.physicsImpostor = new PhysicsImpostor(box, PhysicsImpostor.BoxImpostor, {
        mass: 0,
        friction: 10, // with physics
        restitution: 0
    }, scene);

    const box2 = MeshBuilder.CreateBox("crate", { width: 5, height: 1, depth: 5 }, scene);
    box2.position = new Vector3(10, 0.5, -10);
    box2.material = boxMaterial; // Static
    box2.physicsImpostor = new PhysicsImpostor(box2, PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.0, friction: 2 }, scene);
}

class PhysicsSceneWithAmmo implements CreateSceneClass {
    preTasks = [ammoReadyPromise];

    createScene = async (engine: Engine, canvas: HTMLCanvasElement): Promise<Scene> => {
        // This creates a basic Babylon Scene object (non-mesh)
        const scene = new Scene(engine);
        scene.enablePhysics(new Vector3(0, -20, 0), new AmmoJSPlugin(true, ammoModule));
        scene.debugLayer.show();
        initShaders();

        const light = new DirectionalLight("light", new Vector3(0.15, -1, 0.15), scene);
        const light2 = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
        light.intensity = 4;
        light2.intensity = 0.4;

        var camera = new UniversalCamera("FreeCamera", new Vector3(0, 3, 16), scene);
        camera.inputs.attached.mouse.attachControl()
        camera.minZ = 0.45;
        camera.fov = Math.PI / 2;

        const headMesh = (await importMesh(scene, "head.glb"))[0]
        headMesh.physicsImpostor = new PhysicsImpostor(headMesh, PhysicsImpostor.CapsuleImpostor, { mass: 0, friction: 0, restitution: 0.3 });
        headMesh.position.addInPlace(new Vector3(10, 14, 0))
        headMesh.scaling = new Vector3(0.5, 0.5, 0.5)

        const [candleRoot, candle] = (await importMesh(scene, "Candle.glb"))
        candleRoot.physicsImpostor = new PhysicsImpostor(candleRoot, PhysicsImpostor.CapsuleImpostor, { mass: 0, friction: 0, restitution: 0.3 });
        candleRoot.position.addInPlace(new Vector3(10, 14, 16));
        candle.material = getSubsurfaceMaterial(scene, camera.position, new Texture("textures/ambient.jpg", scene));
        scaleToSize(candleRoot, 1);

        await createStand(new Vector3(10, 0, 0), scene);
        await createStand(new Vector3(10, 0, 8), scene);
        await createStand(new Vector3(10, 0, 16), scene);

        const switchMesh = (await importMesh(scene, "switch.glb"))[0]
        switchMesh.physicsImpostor = new PhysicsImpostor(switchMesh, PhysicsImpostor.MeshImpostor, { mass: 0, friction: 0, restitution: 0.3 });
        switchMesh.position.addInPlace(new Vector3(10, 13.2, 8))

        //Ground
        var ground = MeshBuilder.CreatePlane("ground", { width: 100, height: 100 }, scene);
        ground.isPickable = false;
        const material = new StandardMaterial('DefaultWhite', scene)
        material.diffuseColor = new Color3(1, 1, 1)
        const heroMaterial = new StandardMaterial('HeroMaterial', scene)
        heroMaterial.diffuseColor = new Color3(0, 1, 0)
        ground.material = material;
        ground.position = new Vector3(5, 0, -15);
        ground.rotation = new Vector3(Math.PI / 2, 0, 0);
        ground.physicsImpostor = new PhysicsImpostor(ground, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.6, friction: 0.1 });

        //Simple crate
        const hero = MeshBuilder.CreateBox("crate", { width: 1, height: 1, depth: 1 }, scene);
        hero.isPickable = false;
        hero.position = new Vector3(15, 10, 15);
        hero.material = heroMaterial;
        hero.physicsImpostor = new PhysicsImpostor(hero, PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.0, friction: 0.1 }, scene);
        hero.physicsImpostor.type

        initControl(camera, hero)
        initMultiplayer(scene, hero)
        const inspectController = new InspectController(camera)
        initInspectMode(scene, camera, inspectController)

        return scene;
    };
}

export default new PhysicsSceneWithAmmo();
