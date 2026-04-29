import { world } from '@minecraft/server';

import { success, error } from '../runs/install';
import { hasRights } from '../runs/run';
import { ban } from '../commands/ban';

world.afterEvents.entityHitEntity.subscribe((event) => {

    const damager = event.hitEntity;
    const hitter = event.damagingEntity;
    const slot = hitter.selectedSlotIndex;

    const inventory = hitter.getComponent('inventory').container;
    const mainHand = hitter.getComponent('equippable')?.getEquipment('Mainhand');

    const hammerSett = JSON.parse(inventory.getSlot(slot)?.getDynamicProperty('banhammer') ?? '{}');

    if (mainHand?.typeId === 'ban:hammer' && hitter.typeId === 'minecraft:player') {

        if (!hasRights(hitter.name).usehammer) {
            hitter.sendMessage('§cYou do not have permission to use the banhammer');
            hitter.runCommand(error);
            return;
        }

        if (damager.typeId !== 'minecraft:player') {

            if (damager.typeId === 'minecraft:chicken') {
                hitter.playSound('sound.banhammer.chickenJockey');
            } else {
                hitter.runCommand(success);
            }

            hitter.sendMessage(`§l§cBan: §r${damager.typeId.replace('minecraft:', '').replace('chicken', '§aC§bh§ci§dc§ek§fe§an §bJ§co§dc§ek§fe§ay§b!§c!§d!§r')} was removed`);
            damager.remove();
            return;
        }

        if (hasRights(damager.name).op) {

            hitter.sendMessage(`§l§cBan: §r§b${damager.name}§r was not banded because he is an admin`);
            hitter.runCommand(error);
            return;
        }

        const s = hammerSett.time?.s ?? 0
        const m = hammerSett.time?.m ?? 0
        const h = hammerSett.time?.h ?? 0
        const d = hammerSett.time?.d ?? 0

        const reason = hammerSett?.reason ?? 'The banhammer has spoken'

        ban(hitter, damager.name, reason, s, m, h, d);
    }
});