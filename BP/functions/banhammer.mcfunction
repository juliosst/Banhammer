scoreboard objectives add vc dummy
execute unless entity @a run scoreboard objectives remove vc
execute unless score Banhammer vc matches 20.. run scoreboard players add Banhammer vc 1
execute if score Banhammer vc matches 19 run tellraw @a {"rawtext":[{"text":"§6==============================§r\n§cError: §eBanhammer is deprecated\n§cSupported version: §e1.21.13x\n§cAddon version: §e3.0.1\n§cUpdate: §bhttps://mcpedl.com/bedrock-banhammer\n§6==============================§r"}]}
execute if score Banhammer vc matches 20 run title @a actionbar §cError: §eBanhammer is deprecated
execute if score Banhammer vc matches 20 run kick @a §ccannot be joined because Banhammer is outdated