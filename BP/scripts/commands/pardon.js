import { system, world } from '@minecraft/server';
import { hasRights, timeout } from '../runs/run';
import { success, error } from '../runs/install';

export function pardon(senders, select) {

    system.run(() => {

        if (!select) return;

        const banhammer = JSON.parse(world.getDynamicProperty('banhammer'));
        const sender = senders.sourceEntity;

        const sett = banhammer.settings

        if (sender && !hasRights(sender.name).cpardon) {

            sender.sendMessage('§cYou do not have permission to use the command');
            sender.runCommand(error);
            return;
        }

        if (!banhammer.banlist[select]) {

            if (sender) {
                sender.sendMessage(`§l§aUnban: §r§b${select}§r is not banned`);
                sender.runCommand(error);
            } else {
                console.info(`§l§aUnban: §r§b${select}§r is not banned`);
            }

            return;
        }

        delete banhammer.banlist[select];
        world.setDynamicProperty('banhammer', JSON.stringify(banhammer));

        console.info(`§l§aUnban: §r§b${select}§r has been unbanned`);
        sender?.runCommand(success);

        if (timeout[select] !== undefined) {

            system.clearRun(timeout[select]);
        }

        for (const admin of world.getPlayers()) {

            if (hasRights(admin.name).cpardon && (sett.pardon === undefined || sett.pardon)) {

                admin.sendMessage(`§l§aUnban: §r§b${select}§r has been unbanned`);
            }
        }
    });
}