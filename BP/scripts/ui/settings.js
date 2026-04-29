import { system, world } from '@minecraft/server';
import { ModalFormData } from '@minecraft/server-ui';
import { success, error, isOP, install, installSounds } from '../run';

export function settings(sender, banhammer) {
    system.run(() => {
        const settings = new ModalFormData();

        settings.title('§l§6settings');
        settings.toggle('debug', { defaultValue: banhammer.settings?.debug ?? false });
        settings.toggle('sound effects', { defaultValue: banhammer.settings?.sounds ?? true });
        settings.label('§6feedback');
        settings.toggle('ban', { defaultValue: banhammer.settings?.ban ?? true });
        settings.toggle('pardon', { defaultValue: banhammer.settings?.pardon ?? true });
        settings.toggle('auto pardon', { defaultValue: banhammer.settings?.autopardon ?? true });
        settings.toggle('kick', { defaultValue: banhammer.settings?.kick ?? true });
        settings.label('§creset');
        settings.toggle('banlist');
        settings.toggle('settings');
        settings.toggle('permissions');
        settings.toggle('§l§4reset all');
        settings.submitButton('§l§2save');
        settings.show(sender).then((r) => {
            banhammer = JSON.parse(world.getDynamicProperty('banhammer'));

            if (r.canceled) return;
            if (!isOP(sender.name) && !banhammer.permissions[sender.name]?.settings) {
                sender.sendMessage('§cYou do not have permission to change the settings');
                sender.runCommand(error);
                return;
            }

            if (!r.formValues[11]) {
                if (r.formValues[8]) {
                    banhammer.banlist = {};
                }

                if (r.formValues[9]) {
                    banhammer.settings = {};
                } else if (!r.formValues[9]) {
                    banhammer.settings = {
                        debug: r.formValues[0],
                        sounds: r.formValues[1],
                        ban: r.formValues[3],
                        pardon: r.formValues[4],
                        autopardon: r.formValues[5],
                        kick: r.formValues[6]
                    }
                }

                if (r.formValues[10]) {
                    banhammer.permissions = {};
                }

                world.setDynamicProperty('banhammer', JSON.stringify(banhammer));

                sender.sendMessage('§aSettings updated');
                sender.runCommand(success);

                installSounds();
            }

            if (r.formValues[11]) {
                console.log(`§e${sender.name}§c deleted all data from Banhammer`);

                for (const admin of world.getPlayers()) {
                    if (isOP(admin.name)) {
                        admin.sendMessage(`§e${sender.name}§c deleted all data from Banhammer`);
                    }
                }

                sender.runCommand(success);

                world.setDynamicProperty('banhammer', undefined);
                install();
                installSounds();
            }
        })
    })
}