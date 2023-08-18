import { Mesh, Scene } from "@babylonjs/core";
import { io, Socket } from 'socket.io-client'
import { Online } from "./Online";

let socketClient: Socket | null = null
function initServerConnect() {
    try {
        socketClient = io('http://localhost:3001/')
    } catch (e) {
        console.error(e)
    }
}

const UPDATE_POSITION_INTERVAL = 30

export function initMultiplayer(scene: Scene, player: Mesh) {
    initServerConnect()
    const onlineInstance = new Online(scene)
    socketClient?.on("connect", () => {
        const playerName = prompt("Enter name:")
        // @ts-ignore
        window.playerName = playerName
        setInterval(() => {
            socketClient?.emit('playerInfo', {
                user: playerName, position: {
                    x: player.position.x,
                    y: player.position.y,
                    z: player.position.z
                }
            })
        }, UPDATE_POSITION_INTERVAL)
    })
    socketClient?.on("updatePlayers", (data) => {
        onlineInstance.updatePlayers(data)
    })
}