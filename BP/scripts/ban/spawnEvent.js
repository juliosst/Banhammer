import { world } from '@minecraft/server';
import { isOP } from '../run';

world.afterEvents.playerSpawn.subscribe((event) => {
    const banhammer = JSON.parse(world.getDynamicProperty('banhammer'));
    const player = event.player;

    if (event.initialSpawn) {
        if (isOP(player.name)) {
            for (const bans in banhammer.banlist) {
                if (banhammer.banlist[player.name]) {
                    delete banhammer.banlist[bans]
                    world.setDynamicProperty('banhammer', JSON.stringify(banhammer));
                }

                if (banhammer.banlist[bans]?.banId.includes(player.id)) {
                    const banIds = [];
                    for (const banId of banhammer.banlist[bans].banId) {
                        if (player.id !== banId) {
                            banIds.push(banId);
                        }
                    }

                    banhammer.banlist[bans].banId = banIds
                    world.setDynamicProperty('banhammer', JSON.stringify(banhammer));
                }

                if (banhammer.banlist[bans]?.banName.includes(player.name)) {
                    const banNames = [];
                    for (const banName of banhammer.banlist[bans].banName) {
                        if (player.name !== banName) {
                            banNames.push(banName);
                        }
                    }

                    banhammer.banlist[bans].banName = banNames
                    world.setDynamicProperty('banhammer', JSON.stringify(banhammer));
                }
            }
        }
    }
})