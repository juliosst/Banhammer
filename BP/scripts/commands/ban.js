import { system, world } from '@minecraft/server';

import { hasRights, getBanTime, autoPardon, getPlayer } from '../runs/run';
import { success, error } from '../runs/install';
import { disconnect } from '../runs/run';

export function ban(senders, select, reason = 'no reason', ss = 0, mm = 0, hh = 0, dd = 0) {

    system.run(() => {

        if (!senders) return;

        const s = Math.max(0, Math.min(ss, 59));
        const m = Math.max(0, Math.min(mm, 59));
        const h = Math.max(0, Math.min(hh, 23));
        const d = Math.max(0, dd);

        const banhammer = JSON.parse(world.getDynamicProperty('banhammer'));
        const sender = senders?.sourceEntity ?? senders;
        const sett = banhammer.settings

        if (sender && !hasRights(sender.name).cban) {
            sender.sendMessage('§cYou do not have permission to use the command');
            sender.runCommand(error);
            return;
        }

        if (hasRights(select).cban) {

            if (sender) {
                sender.sendMessage(`§l§cBan: §rYou can't ban §b${select} §rif he has banning rights`);
                sender.runCommand(error);
            } else {
                console.info(`§l§cBan: §rYou can't ban §b${select} §rif he has banning rights`);
            }

            return;
        }

        if (banhammer.banlist[select]) {

            if (sender) {
                sender.sendMessage(`§l§cBan: §r§b${select}§r is already banned`);
                sender.runCommand(error);
            } else {
                console.info(`§l§cBan: §r§b${select}§r is already banned`);
            }

            return;
        }

        banhammer.banlist[select] = {
            banName: [select],
            banId: [],
            banFrom: sender?.name ?? 'console',
            banReason: reason,
            banTime: (s + m + h + d === 0) ? 'xxx' : 1000 * (s + m * 60 + h * 3600 + d * 86400) + Date.now()
        }

        world.setDynamicProperty('banhammer', JSON.stringify(banhammer));

        disconnect(select, getPlayer(select).id);
        autoPardon(select);

        const ban = banhammer.banlist[select]
        const time = ban.banTime - Date.now();

        const day = getBanTime(time).d
        const hour = getBanTime(time).h
        const min = getBanTime(time).m
        const sec = getBanTime(time).s

        const banTime = ban.banTime >= 0 ? `${day}d, ${hour}h, ${min}m, ${sec}s` : 'Permanent';

        console.info(`§l§cBan: §r§b${select}§r was banned for §c${reason}§r (§a${banTime}§r)`);

        sender?.runCommand(success);

        for (const admin of world.getPlayers()) {

            if (hasRights(admin.name).cban && (sett.ban === undefined || sett.ban)) {

                admin.sendMessage(`§l§cBan: §r§b${select}§r was banned for §c${reason}§r (§a${banTime}§r)`);
            }
        }
    });
}