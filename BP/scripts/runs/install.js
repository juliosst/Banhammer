import { world, system } from '@minecraft/server';

export let success, error, openMenu;

export function install() {

    system.run(() => {

        if (!world.getDynamicProperty('banhammer')) {
            world.setDynamicProperty('banhammer', JSON.stringify({}))
        }

        let banhammer = JSON.parse(world.getDynamicProperty('banhammer'));

        banhammer = {
            banlist: banhammer?.banlist ?? {},
            settings: banhammer?.settings ?? {},
            permissions: banhammer?.permissions ?? {}
        }

        world.setDynamicProperty('banhammer', JSON.stringify(banhammer));

        if (banhammer.settings.debug) {
            world.sendMessage(`§l§6Debug: §r§a${world.getDynamicProperty('banhammer')}`);
            console.info(`§l§6Debug: §r§a${world.getDynamicProperty('banhammer')}`);
        }
    })
}

export function installSounds() {

    system.run(() => {

        const banhammer = JSON.parse(world.getDynamicProperty('banhammer'));

        if (banhammer.settings.sounds === undefined || banhammer.settings.sounds) {
            openMenu = 'playsound random.pop2 @s';
            success = 'playsound note.pling @s';
            error = 'playsound note.bass @s';
        } else {
            openMenu = 'playsound mute @s';
            success = 'playsound mute @s';
            error = 'playsound mute @s';
        }
    })
}