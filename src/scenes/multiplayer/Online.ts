import { Color3, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3 } from "@babylonjs/core";
import { IPlayerInfo, IPlayerPosition } from "./types";

interface IDiff {
    create: IPlayerInfo[]
    update: IPlayerInfo[]
    delete: IPlayerInfo[]
}

function getPlayerId(name: string) {
    return `player_${name}`
}

function getDiff(oldPlayers: IPlayerInfo[], newPlayers: IPlayerInfo[]) {
    const diff: IDiff = {
        create: [],
        update: [],
        delete: []
    }
    for (let i = 0; i < newPlayers.length; i++) {
        if (oldPlayers.find((el) => el.name === newPlayers[i].name)) {
            diff.update.push(newPlayers[i])
        } else {
            diff.create.push(newPlayers[i])
        }
    }
    for (let i = 0; i < oldPlayers.length; i++) {
        if (!newPlayers.find(el => el.name === oldPlayers[i].name)) {
            diff.delete.push(oldPlayers[i])
        }
    }
    return diff
}

export class Online {
    private players: IPlayerInfo[] = []
    private scene: Scene
    public playerMeshFabric: null | ((name: string) => Mesh) = null
    private renderedPlayers: Mesh[] = []
    constructor(scene: Scene) {
        this.scene = scene
    }
    public updatePlayers(players: IPlayerInfo[]) {
        // @ts-ignore
        const filteredPlayers = players.filter((el) => el.name !== window.playerName)
        this.renderPlayers(filteredPlayers)
        this.players = filteredPlayers
    }
    private defaultPlayerInit(name: string) {
        const hero = MeshBuilder.CreateBox(name, { width: 1, height: 1, depth: 1 }, this.scene);
        const heroMaterial = new StandardMaterial('HeroMaterial', this.scene)
        heroMaterial.diffuseColor = new Color3(0, 1, 0)
        hero.material = heroMaterial;
        return hero
    }
    private renderPlayers(players: IPlayerInfo[]) {
        const diff = getDiff(this.players, players)
        diff.update.forEach(updateEl => {
            const foundPlayer = this.renderedPlayers.find(el => el.name === getPlayerId(updateEl.name))
            if (foundPlayer) {
                foundPlayer.position = new Vector3(updateEl.position.x, updateEl.position.y, updateEl.position.z)
            } else {
                console.warn(`Couldn't update player ${updateEl.name}`)
            }
        });
        diff.create.forEach(createEl => {
            const newPlayer = this.playerMeshFabric ? this.playerMeshFabric(getPlayerId(createEl.name)) : this.defaultPlayerInit(getPlayerId(createEl.name))
            newPlayer.position = new Vector3(createEl.position.x, createEl.position.y, createEl.position.z)
            this.renderedPlayers.push(newPlayer)
        });
        diff.delete.forEach(deleteEl => {
            const foundPlayer = this.renderedPlayers.find(el => el.name === getPlayerId(deleteEl.name))
            if (foundPlayer) {
                this.scene.removeMesh(foundPlayer)
                this.renderedPlayers.splice(this.renderedPlayers.indexOf(foundPlayer), 1)
            }
        });
    }
}