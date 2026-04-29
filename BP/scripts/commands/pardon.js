import { system, world } from '@minecraft/server';
import { success, error, isOP } from '../run';

export function pardon(senders, select) {
    system.run(() => {
        const banhammer = JSON.parse(world.getDynamicProperty('banhammer'));
        const sender = senders.sourceEntity;

        if (sender && !isOP(sender.name) && !banhammer.permissions[sender.name]?.cpardon) {
            sender.sendMessage('§cYou do not have permission to use the command');
            sender.runCommand(error);
            return;
        }

        if (!banhammer.banlist[select]) {
            if (sender) {
                sender.sendMessage(`§l§aUnban: §r§b${select}§r is not banned`);
                sender.runCommand(error);
            }

            if (!sender) {
                console.info(`§l§aUnban: §r§b${select}§r is not banned`);
            }
            return;
        }

        delete banhammer.banlist[select];
        world.setDynamicProperty('banhammer', JSON.stringify(banhammer));

        console.info(`§l§aUnban: §r§b${select}§r has been unbanned`);

        if (sender) {
            sender.runCommand(success);
        }

        for (const admin of world.getPlayers()) {
            if ((isOP(admin.name) || banhammer.permissions[admin.name].cpardon) && (banhammer.settings.pardon === undefined || banhammer.settings.pardon)) {
                admin.sendMessage(`§l§aUnban: §r§b${select}§r has been unbanned`);
            }
        }
    });
}