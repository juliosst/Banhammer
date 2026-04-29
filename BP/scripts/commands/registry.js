import { system, CustomCommandParamType } from '@minecraft/server';

import { banControl } from './banControl';
import { pardon } from './pardon';
import { kick } from './kick';
import { ban } from './ban';
import { id } from './id';

system.beforeEvents.startup.subscribe(({ customCommandRegistry }) => {

    customCommandRegistry.registerEnum('server:reason', ['Unfair Advantage', 'X-Ray', 'Security ban', 'duplicate', 'Hate speech', 'spam', 'duplicate account', 'Bug Abuse', 'Griefing']);

    customCommandRegistry.registerCommand({
        name: 'server:ban',
        description: `§cban a player§r`,
        permissionLevel: 0,
        optionalParameters: [
            { type: CustomCommandParamType.String, name: 'player' },
            { type: CustomCommandParamType.Enum, name: 'server:reason' },
            { type: CustomCommandParamType.Integer, name: 'sec' },
            { type: CustomCommandParamType.Integer, name: 'min' },
            { type: CustomCommandParamType.Integer, name: 'h' },
            { type: CustomCommandParamType.Integer, name: 'day' }
        ]
    }, ban);

    customCommandRegistry.registerCommand({
        name: 'server:pardon',
        description: '§cunban a player§r',
        permissionLevel: 0,
        optionalParameters: [
            { type: CustomCommandParamType.String, name: 'player' }
        ]
    }, pardon);

    customCommandRegistry.registerCommand({
        name: 'server:c-kick',
        description: `§ckick a player§r`,
        permissionLevel: 0,
        optionalParameters: [
            { type: CustomCommandParamType.String, name: 'player' },
            { type: CustomCommandParamType.Enum, name: 'server:reason' }
        ]
    }, kick);

    customCommandRegistry.registerCommand({
        name: 'server:id',
        description: '§cshow the player id§r',
        permissionLevel: 0,
        mandatoryParameters: [
            { type: CustomCommandParamType.String, name: 'player' }
        ]
    }, id);

    customCommandRegistry.registerCommand({
        name: 'server:ban-control',
        description: '§copens the ban panel settings§r',
        permissionLevel: 0
    }, banControl);
});