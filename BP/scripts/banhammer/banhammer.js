import { world } from '@minecraft/server';
import { success, error, isOP } from '../run';
import { ban } from '../commands/ban';

import './settings';

world.afterEvents.entityHitEntity.subscribe((event) => {
    const banhammer = JSON.parse(world.getDynamicProperty('banhammer'));
    const hitter = event.damagingEntity;
    const damager = event.hitEntity;
    const slot = hitter.selectedSlotIndex;
    const inventory = hitter.getComponent('inventory').container;
    const mainHand = hitter.getComponent('equippable')?.getEquipment('Mainhand');
    let ban_settings;

    if (mainHand?.typeId === 'ban:hammer' && hitter.typeId === 'minecraft:player') {

        if (!isOP(hitter.name) && !banhammer.permissions[hitter.name]?.usehammer) {
            hitter.sendMessage(`§cyou are not authorized to use the banhammer`);
            hitter.runCommand(error);
            return;
        }

        if (inventory.getSlot(slot).getDynamicProperty('banhammer')) {
            ban_settings = JSON.parse(inventory.getSlot(slot).getDynamicProperty('banhammer'));
        } else {
            ban_settings = { mode: true };
        }

        if (!ban_settings.mode) return;

        if (damager.typeId !== 'minecraft:player') {
            damager.remove();
            hitter.sendMessage(`§l§cBan: §r${damager.typeId.replace('minecraft:chicken', '§aC§bh§ci§dc§ek§fe§an §bJ§co§dc§ek§fe§ay§b!§c!§d!§r').replace('minecraft:', '')} was removed`);
            hitter.runCommand(success);
            return;
        }

        if (isOP(damager.name)) {
            hitter.sendMessage(`§l§cBan: §r§b${damager.name}§r was not banded because he is an admin`);
            hitter.runCommand(error);
            return;
        }

        ban(hitter, damager.name, ban_settings?.reason ?? 'The banhammer has spoken', ban_settings.time?.s ?? 0, ban_settings.time?.m ?? 0, ban_settings.time?.h ?? 0, ban_settings.time?.d ?? 0);
    }
});