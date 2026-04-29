import { world, system } from '@minecraft/server';
import { install, installSounds } from './install';

import '../commands/registry';
import '../events/event';

install();
installSounds();

export let timeout = {}

export function sendMessage(message, { withs = [], name } = {}) {

    system.run(() => {

        const msg = { translate: String(message), with: [...withs] }

        if (name === undefined) {

            world.sendMessage(msg);

        } else {

            for (const player of world.getPlayers().filter((p) => p.name === name)) {

                player.sendMessage(msg);
            }
        }
    })
}

export function autoPardon(name) {

    const banhammer = JSON.parse(world.getDynamicProperty('banhammer'));
    const sett = banhammer.settings

    function pardon(pName) {

        delete banhammer.banlist[pName];
        world.setDynamicProperty('banhammer', JSON.stringify(banhammer));

        console.info(`§l§aUnban: §r§b${pName}§r has been automatically unbanned`);

        for (const admin of world.getPlayers()) {

            if (hasRights(admin.name).cpardon && (sett.pardon === undefined || sett.pardon)) {

                admin.sendMessage(`§l§aUnban: §r§b${pName}§r has been unbanned`);
            }
        }
    }

    for (const banName in banhammer.banlist) {

        const ban = banhammer.banlist[banName]

        if (ban.banName.includes(name)) {

            if (hasRights(banName).cban) {

                pardon(banName);
                return;
            }

            if (ban.banTime >= 0) {

                if (timeout[banName] !== undefined) {

                    system.clearRun(timeout[banName]);
                }

                timeout[banName] = system.runTimeout(() => {

                    pardon(banName);

                }, Math.max(0, (ban.banTime - Date.now()) / 50))
            }
        }
    }
}

export function disconnect(name = 'name', id = 0) {

    system.run(() => {

        const banhammer = JSON.parse(world.getDynamicProperty('banhammer'));
        const sett = banhammer.settings

        for (const banName in banhammer.banlist) {

            if (!hasRights(name).cban && getPlayer(name).online) {

                const banNames = banhammer.banlist[banName].banName
                const banids = banhammer.banlist[banName].banId

                if (banNames.includes(name) && !banids.includes(id)) {
                    banids.push(id);
                }

                if (!banNames.includes(name) && banids.includes(id)) {
                    banNames.push(name);
                }

                world.setDynamicProperty('banhammer', JSON.stringify(banhammer));

                if (banNames.includes(name) || banids.includes(id)) {

                    const ban = banhammer.banlist[banName]
                    const time = ban.banTime - Date.now();

                    const day = getBanTime(time).d
                    const hour = getBanTime(time).h
                    const min = getBanTime(time).m
                    const sec = getBanTime(time).s

                    const banTime = ban.banTime >= 0 ? `${day}d, ${hour}h, ${min}m, ${sec}s` : 'Permanent';

                    if (!sett?.coBanKick) {
                        world.getDimension('overworld').runCommand(`kick "${name}" You have been banned (${banName})\nReason: ${ban.banReason}\nTime: ${banTime}\nBy: ${ban.banFrom}`);
                    } else {
                        world.getDimension('overworld').runCommand(`kick "${name}" §l§4You have been banned §c(${banName})§r\n§l§6Reason: §r§c${ban.banReason}§r\n§l§6Time: §r§c${banTime}\n§l§6By: §r§c${ban.banFrom}`);
                    }
                }
            }
        }
    })
}

export function hasRights(name) {

    const banhammer = JSON.parse(world.getDynamicProperty('banhammer'));
    const sett = banhammer.permissions[name]

    let op = false, settings = false, usehammer = false, mrights = false, banlist = false, cban = false, cpardon = false, ckick = false, cid = false

    for (const admin of world.getPlayers()) {

        if (admin.name === name && admin.playerPermissionLevel >= 2) op = true;
    }

    if (op || sett?.settings) settings = true;
    if (op || sett?.usehammer) usehammer = true;
    if (op || sett?.mrights) mrights = true;
    if (op || sett?.banlist) banlist = true;
    if (op || sett?.cban) cban = true;
    if (op || sett?.cpardon) cpardon = true;
    if (op || sett?.ckick) ckick = true;
    if (op || sett?.cid) cid = true;

    return { op, settings, usehammer, mrights, banlist, cban, cpardon, ckick, cid };
}

export function getPlayer(name) {
    const player = world.getPlayers().find(p => p.name === name);

    if (player) return { online: true, id: player.id };

    return { online: false };
}

export function getBanTime(ms = 0) {

    const s = Math.floor(ms / 1000) % 60;
    const m = Math.floor(ms / (1000 * 60)) % 60;
    const h = Math.floor(ms / (1000 * 60 * 60)) % 24;
    const d = Math.floor(ms / (1000 * 60 * 60 * 24));

    return { s, m, h, d };
}

system.run(() => {

    const banhammer = JSON.parse(world.getDynamicProperty('banhammer'));

    for (const banName in banhammer.banlist) {

        autoPardon(banName);
    }
})