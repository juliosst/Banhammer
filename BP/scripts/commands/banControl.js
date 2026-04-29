import { system, world } from '@minecraft/server';
import { ActionFormData } from '@minecraft/server-ui';
import { error, openMenu, isOP } from '../run';

import { settings } from '../ui/settings';
import { permissions } from '../ui/permissions';
import { banlist } from '../ui/banlist';

export function banControl(senders) {
    system.run(() => {
        let banhammer = JSON.parse(world.getDynamicProperty('banhammer'));
        const sender = senders.sourceEntity;
        const permission = banhammer.permissions[sender.name]

        if (!sender) return;

        if (!isOP(sender.name) && !permission?.settings && !permission?.mrights && !permission?.banlist) {
            sender.sendMessage('§cYou do not have permission to use the command');
            sender.runCommand(error);
            return;
        }

        const panel = new ActionFormData();
        sender.runCommand(openMenu);

        panel.title('§l§6ban control');
        panel.button('settings', 'textures/ui/icon_setting');
        panel.button('permissions', 'textures/ui/permissions_op_crown');
        panel.button('banlist', 'textures/ui/ban_profile');
        panel.show(sender).then((r) => {
            if (r.canceled) return;

            banhammer = JSON.parse(world.getDynamicProperty('banhammer'));
            sender.runCommand(openMenu);

            // settings

            if (r.selection === 0 && !isOP(sender.name) && !banhammer.permissions[sender.name]?.settings) {
                sender.sendMessage('§cYou do not have permission to change the settings');
                sender.runCommand(error);
            } else if (r.selection === 0) {
                settings(sender, banhammer);
            }

            // permissions

            if (r.selection === 1 && !isOP(sender.name) && !banhammer.permissions[sender.name]?.mrights) {
                sender.sendMessage('§cYou do not have permission to manage permissions');
                sender.runCommand(error);
            } else if (r.selection === 1) {
                permissions(sender, banhammer);
            }

            // ban list

            if (r.selection === 2 && !isOP(sender.name) && !banhammer.permissions[sender.name]?.banlist) {
                sender.sendMessage('§cYou do not have permission to view the banlist');
                sender.runCommand(error);
            } else if (r.selection === 2) {
                banlist(sender, banhammer);
            }
        })
    });
}