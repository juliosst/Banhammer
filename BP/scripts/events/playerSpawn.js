import { world } from '@minecraft/server';
import { autoPardon, disconnect } from '../runs/run';

world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {

    if (initialSpawn) {

        disconnect(player.name, player.id);
        autoPardon(player.name);
    }
})