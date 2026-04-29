import { system, world } from '@minecraft/server';

import { success, error } from '../runs/install';
import { hasRights, getPlayer } from '../runs/run';

export function kick(senders, select, reason = 'no reason') {

    system.run(() => {

        if (!senders) return;

        const banhammer = JSON.parse(world.getDynamicProperty('banhammer'));
        const sett = banhammer.settings

        const sender = senders.sourceEntity;

        if (sender && !hasRights(sender.name).ckick) {
            sender.sendMessage('§cYou do not have permission to use the command');
            sender.runCommand(error);
            return;
        }

        if (!getPlayer(select).online) {

            if (sender) {
                sender.sendMessage(`§l§cKick: §rYou can't kick §b${select}§r because he's not online`);
                sender.runCommand(error);
            } else {
                console.info(`§l§cKick: §rYou can't kick §b${select}§r because he's not online`)
            }

            return;
        }

        if (hasRights(select).ckick) {

            if (sender) {
                sender.sendMessage(`§l§cKick: §ryou can't kick §b${select} §rbecause he is an admin`);
                sender.runCommand(error);
            } else {
                console.info(`§l§cKick: §ryou can't kick §b${select} §rbecause he is an admin`);
            }

            return;
        }

        if (!sett?.coBanKick) {
            sender.runCommand(`kick "${select}" You have been kicked (${select})\nReason: ${reason}`);
        } else {
            sender.runCommand(`kick "${select}" §l§4You have been kicked §c(${select})§r\n§l§6Reason: §r§c${reason}`);
        }

        console.info(`§l§ckick: §r§b${select}§r was kicked for §c${reason}§r`);

        sender?.runCommand(success);

        for (const admin of world.getPlayers()) {

            if (hasRights(admin.name).ckick && (sett.kick === undefined || sett.kick)) {

                admin.sendMessage(`§l§cKick: §r§b${select}§r was kicked for §c${reason}§r`);
            }
        }
    });
}