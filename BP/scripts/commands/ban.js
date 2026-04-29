import { system, world } from '@minecraft/server';
import { success, error, isOP } from '../run';

export function ban(senders, select, reason = 'no reason', s = 0, m = 0, h = 0, d = 0) {
    system.run(() => {
        const banhammer = JSON.parse(world.getDynamicProperty('banhammer'));
        const sender = senders?.sourceEntity ?? senders;

        if (senders.sourceEntity && !isOP(sender.name) && !banhammer.permissions[sender.name]?.cban) {
            sender.sendMessage('§cYou do not have permission to use the command');
            sender.runCommand(error);
            return;
        }

        if (isOP(select) || banhammer.permissions[select]?.cban) {
            if (!senders.sourceEntity) {
                console.info(`§l§cBan: §rYou can't ban §b${select} §rif he has banning rights`);
            }

            if (senders.sourceEntity) {
                sender.sendMessage(`§l§cBan: §rYou can't ban §b${select} §rif he has banning rights`);
                sender.runCommand(error);
            }
            return;
        }

        if (banhammer.banlist[select]) {
            if (senders.sourceEntity) {
                sender.sendMessage(`§l§cBan: §r§b${select}§r is already banned`);
                sender.runCommand(error);
            }

            if (!senders.sourceEntity) {
                console.info(`§l§cBan: §r§b${select}§r is already banned`);
            }
            return;
        }

        banhammer.banlist[select] = {
            banName: [select],
            banId: [],
            banFrom: sender?.name ?? 'console',
            banReason: reason,
            banTime: (s + m + h + d === 0) ? 'xxx' : s + m * 60 + h * 3600 + d * 86400
        }

        world.setDynamicProperty('banhammer', JSON.stringify(banhammer));

        const ban = banhammer.banlist[select]
        const day = Math.floor(ban.banTime / 86400);
        ban.banTime %= 86400;
        const hour = Math.floor(ban.banTime / 3600);
        ban.banTime %= 3600;
        const min = Math.floor(ban.banTime / 60);
        const sec = ban.banTime % 60;
        const newTime = ban.banTime >= 0 ? `${day}d, ${hour}h, ${min}m, ${sec}s` : 'Permanent';

        console.info(`§l§cBan: §r§b${select}§r was banned for §c${reason}§r (§a${newTime}§r)`);

        if (senders.sourceEntity) {
            sender.runCommand(success);
        }

        for (const admin of world.getPlayers()) {
            if ((isOP(admin.name) || banhammer.permissions[admin.name].cban) && (banhammer.settings.ban === undefined || banhammer.settings.ban)) {
                admin.sendMessage(`§l§cBan: §r§b${select}§r was banned for §c${reason}§r (§a${newTime}§r)`);
            }
        }
    });
}