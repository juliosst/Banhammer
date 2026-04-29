import { system, world } from '@minecraft/server';
import { ActionFormData } from '@minecraft/server-ui';

import { error, openMenu } from '../runs/install';
import { permissions } from '../ui/permissions';
import { settings } from '../ui/settings';
import { banlist } from '../ui/banlist';
import { hasRights } from '../runs/run';

export function banControl(senders) {

    system.run(() => {

        let banhammer = JSON.parse(world.getDynamicProperty('banhammer'));
        const sender = senders.sourceEntity;
        const permission = banhammer.permissions[sender.name]

        if (!sender) return;

        if (!hasRights(sender.name).op && !permission?.settings && !permission?.mrights && !permission?.banlist) {
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

            if (r.selection === 0 && !hasRights(sender.name).settings) {
                sender.sendMessage('§cYou do not have permission to change the settings');
                sender.runCommand(error);
            } else if (r.selection === 0) {
                settings(sender, banhammer);
            }

            // permissions

            if (r.selection === 1 && !hasRights(sender.name).mrights) {
                sender.sendMessage('§cYou do not have permission to manage permissions');
                sender.runCommand(error);
            } else if (r.selection === 1) {
                permissions(sender, banhammer);
            }

            // ban list

            if (r.selection === 2 && !hasRights(sender.name).banlist) {
                sender.sendMessage('§cYou do not have permission to view the banlist');
                sender.runCommand(error);
            } else if (r.selection === 2) {
                banlist(sender, banhammer);
            }
        })
    });
}