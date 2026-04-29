import { system, world } from '@minecraft/server';
import { ModalFormData } from '@minecraft/server-ui';

import { success, error, install, installSounds } from '../runs/install';
import { hasRights } from '../runs/run';

export function settings(sender, banhammer) {

    system.run(() => {

        const sett = banhammer.settings

        const settings = new ModalFormData();

        settings.title('§l§6settings');
        settings.toggle('debug', { defaultValue: sett?.debug ?? false }); // 0
        settings.toggle('colored ban/kick screen', { defaultValue: sett?.coBanKick ?? false }); // 1
        settings.toggle('sound effects', { defaultValue: sett?.sounds ?? true }); // 2
        settings.label('§6feedback'); // 3
        settings.toggle('ban', { defaultValue: sett?.ban ?? true }); // 4
        settings.toggle('pardon', { defaultValue: sett?.pardon ?? true }); // 5
        settings.toggle('auto pardon', { defaultValue: sett?.autopardon ?? true }); // 6
        settings.toggle('kick', { defaultValue: sett?.kick ?? true }); // 7
        settings.label('§creset'); // 8
        settings.toggle('banlist'); // 9
        settings.toggle('settings'); // 10
        settings.toggle('permissions'); // 11
        settings.toggle('§l§4reset all'); // 12
        settings.submitButton('§l§2save');
        settings.show(sender).then((r) => {

            banhammer = JSON.parse(world.getDynamicProperty('banhammer'));

            if (r.canceled) return;

            if (!hasRights(sender.name).settings) {

                sender.sendMessage('§cYou do not have permission to change the settings');
                sender.runCommand(error);
                return;
            }

            if (!r.formValues[12]) {

                if (r.formValues[9]) {
                    banhammer.banlist = {};
                }

                if (r.formValues[10]) {
                    banhammer.settings = {};
                } else {
                    banhammer.settings = {
                        debug: r.formValues[0],
                        coBanKick: r.formValues[1],
                        sounds: r.formValues[2],
                        ban: r.formValues[4],
                        pardon: r.formValues[5],
                        autopardon: r.formValues[6],
                        kick: r.formValues[7]
                    }
                }

                if (r.formValues[11]) {
                    banhammer.permissions = {};
                }

                world.setDynamicProperty('banhammer', JSON.stringify(banhammer));

                sender.sendMessage('§aSettings updated');
                sender.runCommand(success);

                installSounds();

            } else {

                console.info(`§e${sender.name}§c deleted all data from Banhammer`);

                for (const admin of world.getPlayers()) {

                    if (hasRights(sender.name).op) {
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