import { world, system } from '@minecraft/server';

import { success, error } from '../runs/install';
import { hasRights } from '../runs/run';

export function id(senders, select) {

    system.run(() => {

        const sender = senders.sourceEntity;

        if (sender && !hasRights(sender.name).cid) {

            sender.sendMessage('§cYou do not have permission to use the command');
            sender.runCommand(error);
            return;
        }

        for (const player of world.getPlayers()) {

            if (select === player.name) {

                if (sender) {
                    sender.sendMessage(`§aName: ${player.name}, §eId: ${player.id}`);
                    sender.runCommand(success);
                }

                if (!sender) {
                    console.info(`§aName: ${player.name}, §eId: ${player.id}`);
                }
                return;
            }

            if (sender) {
                sender.sendMessage(`§cYou can't check §e${select}§c ID because he's offline`);
                sender.runCommand(error);
            } else {
                console.info(`§cYou can't check §e${select}§c ID because he's offline`);
            }
        }
    })
}