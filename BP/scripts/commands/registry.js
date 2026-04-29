import { system, CommandPermissionLevel, CustomCommandParamType } from '@minecraft/server';

import { ban } from './ban';
import { pardon } from './pardon';
import { id } from './id';
import { banControl } from './banControl';
import { kick } from './kick';

system.beforeEvents.startup.subscribe(({ customCommandRegistry }) => {
    customCommandRegistry.registerCommand({
        name: 'server:ban',
        description: `§cban a player§r`,
        permissionLevel: CommandPermissionLevel.Any,
        mandatoryParameters: [
            { type: CustomCommandParamType.String, name: 'player' }
        ],
        optionalParameters: [
            { type: CustomCommandParamType.String, name: 'reason' },
            { type: CustomCommandParamType.Integer, name: 'sec' },
            { type: CustomCommandParamType.Integer, name: 'min' },
            { type: CustomCommandParamType.Integer, name: 'h' },
            { type: CustomCommandParamType.Integer, name: 'day' }
        ]
    }, ban);

    customCommandRegistry.registerCommand({
        name: 'server:pardon',
        description: '§cunban a player§r',
        permissionLevel: CommandPermissionLevel.Any,
        mandatoryParameters: [
            { type: CustomCommandParamType.String, name: 'player' }
        ],
        optionalParameters: []
    }, pardon);

    customCommandRegistry.registerCommand({
        name: 'server:c-kick',
        description: `§ckick a player§r`,
        permissionLevel: CommandPermissionLevel.Any,
        mandatoryParameters: [
            { type: CustomCommandParamType.String, name: 'player' }
        ],
        optionalParameters: [
            { type: CustomCommandParamType.String, name: 'reason' }
        ]
    }, kick);

    customCommandRegistry.registerCommand({
        name: 'server:id',
        description: '§cshow the player id§r',
        permissionLevel: CommandPermissionLevel.Any,
        mandatoryParameters: [
            { type: CustomCommandParamType.String, name: 'player' }
        ],
        optionalParameters: []
    }, id);

    customCommandRegistry.registerCommand({
        name: 'server:ban-control',
        description: '§copens the ban panel settings§r',
        permissionLevel: CommandPermissionLevel.Any,
        mandatoryParameters: [],
        optionalParameters: []
    }, banControl);
});