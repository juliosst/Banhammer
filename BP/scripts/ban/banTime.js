import { system, world } from '@minecraft/server';
import { isOP } from '../run';

system.runInterval(() => {
    const banhammer = JSON.parse(world.getDynamicProperty('banhammer'));

    for (const name in banhammer.banlist) {
        if (banhammer.banlist[name].banTime >= 0) {
            banhammer.banlist[name].banTime -= 1
        }

        if (banhammer.banlist[name].banTime < 0) {
            console.info(`§l§aUnban: §r§b${name}§r has been automatically unbanned`);

            for (const admin of world.getPlayers()) {
                if (isOP(admin.name) && (banhammer.settings.autopardon === undefined || banhammer.settings.autopardon)) {
                    admin.sendMessage(`§l§aUnban: §r§b${name}§r has been automatically unbanned`);
                }
            }

            delete banhammer.banlist[name];
        }
        world.setDynamicProperty('banhammer', JSON.stringify(banhammer));
    }
}, 20);