import { system, world } from '@minecraft/server';
import { success, error, isOP } from '../run';

export function kick(senders, select, reason = 'no reason') {
    system.run(() => {
        const banhammer = JSON.parse(world.getDynamicProperty('banhammer'));
        const sender = senders.sourceEntity;

        if (!isOP(sender.name) && !banhammer.permissions[sender.name]?.ckick) {
            sender.sendMessage('§cYou do not have permission to use the command');
            sender.runCommand(error);
            return;
        }

        let offline = true;

        for (const player of world.getPlayers()) {
            if (select === player.name) offline = false
            break;
        }

        if (offline) {
            sender.sendMessage(`§l§cKick: §rYou can't kick §b${select}§r because he's not online`);
            sender.runCommand(error);
            return;
        }

        if (isOP(select) || banhammer.permissions[select]?.ckick) {
            if (!senders.sourceEntity) {
                console.info(`§l§cKick: §ryou can't kick §b${select} §rbecause he is an admin`);
            }

            if (senders.sourceEntity) {
                sender.sendMessage(`§l§cKick: §ryou can't kick §b${select} §rbecause he is an admin`);
                sender.runCommand(error);
            }
            return;
        }

        sender.runCommand(`kick "${select}" §l§4You have been kicked §c(${select})§r\n§l§6Reason: §r§c${reason}`);

        console.info(`§l§ckick: §r§b${select}§r was kicked for §c${reason}§r`);

        if (senders.sourceEntity) {
            sender.runCommand(success);
        }

        for (const admin of world.getPlayers()) {
            if ((isOP(admin.name) || banhammer.permissions[admin.name].ckick) && (banhammer.settings.kick === undefined || banhammer.settings.kick)) {
                admin.sendMessage(`§l§cKick: §r§b${select}§r was kicked for §c${reason}§r`);
            }
        }
    });
}