import { system, world } from '@minecraft/server';
import { isOP } from '../run';

import './banTime';
import './spawnEvent';

system.runInterval(() => {
    if (!world.getDynamicProperty('banhammer')) return;

    const banhammer = JSON.parse(world.getDynamicProperty('banhammer'));

    world.getDimension('overworld').runCommand('scoreboard players set Banhammer vc 0');

    for (const player of world.getPlayers()) for (const banName in banhammer.banlist) {
        if (!isOP(player.name)) {
            if (banhammer.banlist[banName].banName.includes(player.name) && !banhammer.banlist[banName].banId.includes(player.id)) {
                banhammer.banlist[banName].banId.push(player.id);
                world.setDynamicProperty('banhammer', JSON.stringify(banhammer));
            }

            if (!banhammer.banlist[banName].banName.includes(player.name) && banhammer.banlist[banName].banId.includes(player.id)) {
                banhammer.banlist[banName].banName.push(player.name);
                world.setDynamicProperty('banhammer', JSON.stringify(banhammer));
            }

            if (banhammer.banlist[banName].banName.includes(player.name) && banhammer.banlist[banName].banId.includes(player.id)) {

                const ban = banhammer.banlist[banName]
                const day = Math.floor(ban.banTime / 86400);
                ban.banTime %= 86400;
                const hour = Math.floor(ban.banTime / 3600);
                ban.banTime %= 3600;
                const min = Math.floor(ban.banTime / 60);
                const sec = ban.banTime % 60;
                const newTime = ban.banTime >= 0 ? `${day}d, ${hour}h, ${min}m, ${sec}s` : 'Permanent';

                world.getDimension('overworld').runCommand(`kick "${player.name}" §l§4You have been banned §c(${ban.banName[0]})§r\n§l§6Reason: §r§c${ban.banReason}§r\n§l§6Time: §r§c${newTime}\n§l§6By: §r§c${ban.banFrom}`);
            }
        }
    }
});