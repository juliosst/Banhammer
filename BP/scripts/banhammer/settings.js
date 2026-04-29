import { world, ItemStack } from '@minecraft/server';
import { ModalFormData } from '@minecraft/server-ui';
import { success, error, openMenu, isOP } from '../run';

world.afterEvents.itemUse.subscribe((event) => {
    const banhammer = JSON.parse(world.getDynamicProperty('banhammer'));
    const player = event.source;
    let slot = player.selectedSlotIndex;

    if (event.itemStack.typeId === 'ban:hammer') {
        const inventory = player.getComponent('inventory').container;
        const debug = inventory.getSlot(slot).getDynamicProperty('banhammer');
        const ban_hammer = debug ? JSON.parse(debug) : {};
        const item = new ItemStack('ban:hammer', 1);
        const hammerMenu = new ModalFormData();

        if (!isOP(player.name) && !banhammer.permissions[player.name]?.usehammer) {
            player.sendMessage(`§cyou are not authorized to use the banhammer`);
            player.runCommand(error);
            return;
        }

        if (ban_hammer.locked) return;

        if (banhammer.settings.debug) {
            world.sendMessage(`§l§6Debug: §r§a${debug}`);
            console.log(`§l§6Debug: §r§a${debug}`);
        }

        player.runCommand(openMenu);

        hammerMenu.title('§l§cBanhammer');
        hammerMenu.label('§l§6settings');
        hammerMenu.toggle('enabled', { defaultValue: ban_hammer?.mode ?? true });
        hammerMenu.toggle('lock settings');
        hammerMenu.toggle('hide settings', { defaultValue: ban_hammer?.hide ?? false });
        hammerMenu.textField('§l§6reason', '', { defaultValue: ban_hammer?.reason ?? 'The banhammer has spoken' });
        hammerMenu.label('§l§6time');
        hammerMenu.slider('§csecond(s)', 0, 59, { defaultValue: ban_hammer.time?.s ?? 0 });
        hammerMenu.slider('§cminute(s)', 0, 59, { defaultValue: ban_hammer.time?.m ?? 0 });
        hammerMenu.slider('§chour(s)', 0, 23, { defaultValue: ban_hammer.time?.h ?? 0 });
        hammerMenu.slider('§cday(s)', 0, 365, { defaultValue: ban_hammer.time?.d ?? 0 });
        hammerMenu.submitButton('§l§2save');
        hammerMenu.show(player).then((r) => {
            const values = r.formValues;
            let dmode, mode, time

            if (r.canceled) return;

            if (inventory.getSlot(slot).getItem()?.typeId !== 'ban:hammer') {
                player.sendMessage('§cError when applying settings');
                player.runCommand(error);
                return;
            }

            if (values[1] === true) {
                dmode = '§aenabled';
                mode = true;
            } else if (values[1] === false) {
                dmode = '§cdisabled';
                mode = false;
            }

            if (values[6] + values[7] + values[8] + values[9] === 0) {
                time = 'permanent';
            } else {
                time = `${values[9]}d, ${values[8]}h, ${values[7]}m, ${values[6]}s`;
            }

            item.setDynamicProperty('banhammer', JSON.stringify({
                mode,
                locked: values[2],
                hide: values[3],
                reason: values[4],
                time: { s: values[6], m: values[7], h: values[8], d: values[9] }
            }));

            if (values[3]) {
                item.setLore();
            } else {
                item.setLore([`§r§l§4Ban Settings:
§r${dmode} ${values[2] ? '§8(locked)' : ''}§r
§l§6Reason: §r§c${values[4]}
§l§6Time: §r§c${time}`]);
            }

            inventory.setItem(slot, item);

            player.runCommand(success);
            player.sendMessage('§aSettings updated');

            if (values[2]) {
                player.sendMessage('§eThe settings for this item are locked and cannot be changed');
            }
        })
    }
})