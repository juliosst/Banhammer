import { system, world } from '@minecraft/server';
import { ActionFormData, ModalFormData } from '@minecraft/server-ui';
import { error, openMenu, isOP } from '../run';

export function banlist(sender, banhammer) {
    system.run(() => {
        const banlist = new ActionFormData();

        banlist.title('§l§6banlist');
        banlist.body(`§abanned players: §e${Object.keys(banhammer.banlist).length}`);
        banlist.button('§l§2search', 'textures/ui/search');

        for (const banName in banhammer.banlist) {
            const ban = banhammer.banlist[banName]
            const day = Math.floor(ban.banTime / 86400);
            ban.banTime %= 86400;
            const hour = Math.floor(ban.banTime / 3600);
            ban.banTime %= 3600;
            const min = Math.floor(ban.banTime / 60);
            const sec = ban.banTime % 60;
            const time = ban.banTime >= 0 ? `${day}d, ${hour}h, ${min}m, ${sec}s` : 'Permanent';

            banlist.button(`§6${banName}\n§c${time}`, 'textures/ui/ban_profile');
        }

        banlist.show(sender).then((r) => {
            banhammer = JSON.parse(world.getDynamicProperty('banhammer'));

            if (r.canceled) return;
            if (!isOP(sender.name) && !banhammer.permissions[sender.name]?.banlist) {
                sender.sendMessage('§cYou do not have permission to view the banlist');
                sender.runCommand(error);
                return;
            }

            sender.runCommand(openMenu);

            if (r.selection === 0) {
                const search = new ModalFormData();
                search.title('§l§6banlist');
                search.textField('name:', '');
                search.submitButton('§l§2search');
                search.show(sender).then((r) => {
                    banhammer = JSON.parse(world.getDynamicProperty('banhammer'));

                    if (r.canceled) return;
                    if (!isOP(sender.name) && !banhammer.permissions[sender.name]?.banlist) {
                        sender.sendMessage('§cYou do not have permission to view the banlist');
                        sender.runCommand(error);
                        return;
                    }

                    if (r.formValues[0].length <= 0) {
                        sender.sendMessage('§cThe field must not be empty');
                        sender.runCommand(error);
                        return;
                    }

                    let results = [];

                    for (const name in banhammer.banlist) {
                        if (String(banhammer.banlist[name].banName).includes(r.formValues[0])) {
                            results.push(name);
                        }
                    }

                    if (results.length >= 1) {
                        sender.runCommand(openMenu);
                        showBan(results[0], r.formValues[0], results, 0);
                    } else {
                        sender.sendMessage(`§cBanned players with§e ${r.formValues[0]} §cnot found`);
                        sender.runCommand(error);
                    }
                })
            }

            if (r.selection >= 1) {
                showBan(Object.keys(banhammer.banlist)[r.selection - 1]);
            }

            function showBan(banName, search, results, pageNow) {
                const ban = banhammer.banlist[banName]
                const day = Math.floor(ban.banTime / 86400);
                ban.banTime %= 86400;
                const hour = Math.floor(ban.banTime / 3600);
                ban.banTime %= 3600;
                const min = Math.floor(ban.banTime / 60);
                const sec = ban.banTime % 60;
                const time = ban.banTime >= 0 ? `${day}d, ${hour}h, ${min}m, ${sec}s` : 'Permanent';

                const names = search ? String(ban.banName).replaceAll(search, `§l§e${search}§r§c`) : ban.banName;
                const ids = String(ban.banId).replaceAll(',', ', ');

                const banlist = new ActionFormData();

                banlist.title(`§l§6${banName}`);
                banlist.body(`§6name: §c${banName}, §6by: §c${ban.banFrom}`);
                banlist.label(`§6time: §c${time}`);
                banlist.label(`§6names: §c${String(names).replaceAll(',', ', ')}`);
                banlist.label(`§6ids: §c${ids}`);
                banlist.label(`§6reason: §c${ban.banReason}`);
                if (results && results.length >= 2) {
                    banlist.label(`§6Page: §e${pageNow + 1}/${results.length}`);
                    banlist.button('§l§0next', 'textures/ui/next');
                    banlist.button('§l§0back', 'textures/ui/back');
                } else {
                    banlist.button('§l§0update', 'textures/ui/ui-update');
                }

                banlist.show(sender).then((r) => {
                    banhammer = JSON.parse(world.getDynamicProperty('banhammer'));

                    if (r.canceled) return;
                    if (!isOP(sender.name) && !banhammer.permissions[sender.name]?.banlist) {
                        sender.sendMessage('§cYou do not have permission to view the banlist');
                        sender.runCommand(error);
                        return;
                    }

                    sender.runCommand(openMenu);

                    if (results && results.length >= 2) {
                        let page;

                        if (r.selection === 0) page = pageNow + 1;
                        if (r.selection === 1) page = pageNow - 1;

                        if (page > results.length - 1) page = 0;
                        if (page < 0) page = results.length - 1;

                        showBan(results[page], search, results, page);
                    } else {
                        if (r.selection === 0) {
                            showBan(banName, search, results, pageNow);
                        }
                    }
                })
            }
        })
    })
}