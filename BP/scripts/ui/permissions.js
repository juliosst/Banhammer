import { system, world } from '@minecraft/server';
import { ActionFormData, ModalFormData } from '@minecraft/server-ui';

import { success, error, openMenu } from '../runs/install';
import { hasRights } from '../runs/run';

export function permissions(sender, banhammer) {

    system.run(() => {

        const selectRights = new ActionFormData();

        selectRights.title('§l§6permissions');
        selectRights.body(`§aplayers with ban permissions: §e${Object.keys(banhammer.permissions).length}`);
        selectRights.button('§l§2add', 'textures/ui/add');
        for (const rightName in banhammer.permissions) {
            selectRights.button(rightName, 'textures/ui/icon_steve');
        }
        selectRights.show(sender).then((r) => {
            banhammer = JSON.parse(world.getDynamicProperty('banhammer'));

            if (r.canceled) return;

            if (!hasRights(sender.name).mrights) {
                sender.sendMessage('§cYou do not have permission to manage permissions');
                sender.runCommand(error);
                return;
            }

            if (r.selection === 0) {

                sender.runCommand(openMenu);

                const add = new ModalFormData();
                add.title('§l§6permissions');
                add.textField('name:', '');
                add.submitButton('§l§2edit permission');
                add.show(sender).then((r) => {

                    banhammer = JSON.parse(world.getDynamicProperty('banhammer'));

                    if (r.canceled) return;

                    if (!hasRights(sender.name).mrights) {
                        sender.sendMessage('§cYou do not have permission to manage permissions');
                        sender.runCommand(error);
                        return;
                    }

                    if (r.formValues[0].length <= 0) {
                        sender.sendMessage('§cThe field must not be empty');
                        sender.runCommand(error);
                        return;
                    }

                    changeRights(r.formValues[0]);
                })
            }

            if (r.selection >= 1) {
                changeRights(Object.keys(banhammer.permissions)[r.selection - 1]);
            }

            function changeRights(rightName) {

                if (!hasRights(sender.name).op && sender.name === rightName) {

                    sender.sendMessage('§cOnly operators are allowed to manage their own rights');
                    sender.runCommand(error);
                    return;
                }

                sender.runCommand(openMenu);

                const addrights = new ModalFormData();
                const setts = banhammer.permissions[rightName]

                addrights.title(`§l§6${rightName}`);
                addrights.toggle('§cremove permissions');
                addrights.toggle('use banhammer', { defaultValue: setts?.usehammer ?? true });
                addrights.label('§6ban control');
                addrights.toggle('settings', { defaultValue: setts?.settings ?? false });
                addrights.toggle('manage rights', { defaultValue: setts?.mrights ?? false });
                addrights.toggle('ban list', { defaultValue: setts?.banlist ?? true });
                addrights.label('§6commands');
                addrights.toggle('/ban', { defaultValue: setts?.cban ?? true });
                addrights.toggle('/pardon', { defaultValue: setts?.cpardon ?? true });
                addrights.toggle('/kick', { defaultValue: setts?.cpardon ?? true });
                addrights.toggle('/id', { defaultValue: setts?.cid ?? true });
                addrights.submitButton('§l§2save');
                addrights.show(sender).then((r) => {
                    banhammer = JSON.parse(world.getDynamicProperty('banhammer'));

                    if (r.canceled) return;

                    if (!hasRights(sender.name).mrights) {
                        sender.sendMessage('§cYou do not have permission to manage permissions');
                        sender.runCommand(error);
                        return;
                    }

                    if (!hasRights(sender.name).op && sender.name === rightName) {
                        sender.sendMessage('§cOnly operators are allowed to manage their own rights');
                        sender.runCommand(error);
                        return;
                    }

                    if (r.formValues[0]) {
                        if (banhammer.permissions[rightName]) {
                            delete banhammer.permissions[rightName];
                            world.setDynamicProperty('banhammer', JSON.stringify(banhammer));
                        }

                        sender.sendMessage(`§aPermissions for §e${rightName}§a removed`);
                        sender.runCommand(success);
                        return;
                    }

                    banhammer.permissions[rightName] = {
                        usehammer: r.formValues[1],
                        settings: r.formValues[3],
                        mrights: r.formValues[4],
                        banlist: r.formValues[5],
                        cban: r.formValues[7],
                        cpardon: r.formValues[8],
                        ckick: r.formValues[9],
                        cid: r.formValues[10],
                    }

                    world.setDynamicProperty('banhammer', JSON.stringify(banhammer));
                    sender.sendMessage('§aSettings updated');
                    sender.runCommand(success);
                })
            }
        })
    })
}