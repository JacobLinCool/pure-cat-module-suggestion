/* eslint-disable no-self-assign */
import type { I18n, I18nContext } from "pure-cat-module-i18n";
import { BaseModule, Bot, CallNextModule, Module, StoreContext } from "pure-cat";
import { GatewayIntentBits, Message } from "discord.js";
import pangu from "pangu";
import { OpenCC } from "opencc";
import abbreviates from "case-police/dict/abbreviates.json";
import brands from "case-police/dict/brands.json";
import general from "case-police/dict/general.json";
import products from "case-police/dict/products.json";
import softwares from "case-police/dict/softwares.json";
import { i18n_table, tt } from "./i18n";
import { escape_regex, escape_md } from "./utils";

export interface SuggestionOptions {
    pangu?: boolean;
    abbreviates?: boolean;
    brands?: boolean;
    general?: boolean;
    products?: boolean;
    softwares?: boolean;
    opencc?: boolean;
    map?: Record<string, string>;
    sensitve_map?: Record<string, string>;
    pass?: (content: string) => boolean;
    custom_list_max_length?: number;
    custom_list_max_rule_size?: number;
    controller_prefix?: string;
}

export class Suggestion extends BaseModule implements Module {
    name = "suggestion";
    intents = [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
    ];
    map: Record<string, string>;
    sensitive_map: Record<string, string>;
    cc_converter: OpenCC;
    custom_list_max_length: number;
    custom_list_max_rule_size: number;
    controller_prefix: string;

    constructor(private opt: SuggestionOptions = {}) {
        super();

        this.map = {
            ...(this.opt.abbreviates === false ? {} : abbreviates),
            ...(this.opt.brands === false ? {} : brands),
            ...(this.opt.general === false ? {} : general),
            ...(this.opt.products === false ? {} : products),
            ...(this.opt.softwares === false ? {} : softwares),
            ...this.opt.map,
        };

        this.sensitive_map = {
            ...this.opt.sensitve_map,
        };

        this.cc_converter = new OpenCC("s2twp.json");
        this.custom_list_max_length = this.opt.custom_list_max_length ?? 100;
        this.custom_list_max_rule_size = this.opt.custom_list_max_rule_size ?? 20;
        this.controller_prefix = this.opt.controller_prefix ?? "!suggestion";
    }

    async init(bot: Bot): Promise<void> {
        const i18n_module = bot.modules.find((m) => m.name === "i18n") as I18n | undefined;
        if (!i18n_module) {
            throw new Error(
                "i18n module must be loaded before suggestion module (pure-cat-module-i18n)",
            );
        }

        i18n_module.load(i18n_table);
    }

    async messageCreate(
        [message]: [Message],
        ctx: StoreContext & I18nContext<typeof i18n_table>,
        next: CallNextModule,
    ): Promise<void> {
        const content = message.content;
        const chan_store = await ctx.channel<{
            suggestion?: {
                enabled: boolean;
                force: boolean;
                list: [string, string][];
            };
        }>();

        if (chan_store && !chan_store.suggestion) {
            chan_store.suggestion = { enabled: false, force: false, list: [] };
        }

        if (content.startsWith(this.controller_prefix)) {
            const command = content.slice(this.controller_prefix.length).trim();
            const enable_control = command.match(/^(on|off|enable|disable|force)$/);
            if (enable_control && chan_store?.suggestion) {
                if (enable_control[1] === "force") {
                    chan_store.suggestion.force = !chan_store.suggestion.force;
                    chan_store.suggestion = chan_store.suggestion;
                    await message.reply(
                        ctx.t(
                            chan_store.suggestion.force
                                ? tt.suggestion_force_enabled
                                : tt.suggestion_force_disabled,
                        ),
                    );
                } else {
                    const enabled = ["on", "enable"].includes(enable_control[1]);
                    chan_store.suggestion.enabled = enabled;
                    chan_store.suggestion = chan_store.suggestion;
                    await message.reply(
                        ctx.t(enabled ? tt.suggestion_enabled : tt.suggestion_disabled),
                    );
                }
                return;
            }

            const list_control = command.match(
                /^(add|remove|rm|list|ls|clear|export|import|help)\s*([^]*)$/,
            );
            if (list_control && chan_store?.suggestion) {
                const action = list_control[1];
                const arg = list_control[2];

                switch (action) {
                    case "add": {
                        if (chan_store.suggestion.list.length >= this.custom_list_max_length) {
                            await message.reply(ctx.t(tt.suggestion_list_full));
                            return;
                        }

                        const [key, value] = arg.split("=>").map((s) => s.trim());
                        if (chan_store.suggestion.list.find(([k]) => k === key)) {
                            await message.reply(ctx.t(tt.suggestion_list_duplicated));
                            return;
                        } else if (this.check_rule(key, value) === false) {
                            await message.reply(ctx.t(tt.suggestion_list_invalid_rule));
                            return;
                        }

                        chan_store.suggestion.list.push([key, value]);
                        chan_store.suggestion = chan_store.suggestion;
                        await message.reply(ctx.t(tt.suggestion_list_add, { item: key }));
                        break;
                    }
                    case "rm":
                    case "remove": {
                        const idx = chan_store.suggestion.list.findIndex(
                            ([key]) => key === arg.trim(),
                        );
                        if (idx === -1) {
                            await message.reply(ctx.t(tt.suggestion_list_entry_not_found));
                            return;
                        }

                        chan_store.suggestion.list.splice(idx, 1);
                        chan_store.suggestion = chan_store.suggestion;
                        await message.reply(ctx.t(tt.suggestion_list_remove, { item: arg }));
                        break;
                    }
                    case "ls":
                    case "list": {
                        const list = chan_store.suggestion.list.map(
                            ([key, value]) => `**${escape_md(key)}** _=>_ **${escape_md(value)}**`,
                        );
                        await message.reply(
                            `${ctx.t(tt.suggestion_list_list)}\n${list.join("\n")}`,
                        );
                        break;
                    }
                    case "clear": {
                        const size = chan_store.suggestion.list.length;
                        chan_store.suggestion.list = [];
                        chan_store.suggestion = chan_store.suggestion;
                        await message.reply(ctx.t(tt.suggestion_list_clear, { size }));
                        break;
                    }
                    case "export": {
                        await message.reply(
                            "```json\n" + JSON.stringify(chan_store.suggestion.list) + "\n```",
                        );
                        await message.reply(
                            ctx.t(tt.suggestion_list_export, {
                                size: chan_store.suggestion.list.length,
                            }),
                        );
                        break;
                    }
                    case "import": {
                        try {
                            const imported = JSON.parse(arg);
                            if (!Array.isArray(imported)) {
                                await message.reply(ctx.t(tt.suggestion_list_invalid_json));
                                return;
                            }

                            if (
                                imported.length >
                                this.custom_list_max_length - chan_store.suggestion.list.length
                            ) {
                                await message.reply(ctx.t(tt.suggestion_list_full));
                                return;
                            }

                            for (const item of imported) {
                                if (!Array.isArray(item) || item.length !== 2) {
                                    await message.reply(ctx.t(tt.suggestion_list_invalid_json));
                                    return;
                                }

                                if (chan_store.suggestion.list.find(([k]) => k === item[0])) {
                                    continue;
                                } else if (this.check_rule(item[0], item[1]) === false) {
                                    await message.reply(ctx.t(tt.suggestion_list_invalid_rule));
                                    return;
                                }
                            }

                            chan_store.suggestion.list.push(...imported);
                            chan_store.suggestion = chan_store.suggestion;
                            await message.reply(
                                ctx.t(tt.suggestion_list_import, { size: imported.length }),
                            );
                        } catch (e) {
                            await message.reply(ctx.t(tt.suggestion_list_invalid_json));
                        }
                        break;
                    }
                    case "help": {
                        await message.reply(
                            ctx.t(tt.suggestion_list_help, { prefix: this.controller_prefix }),
                        );
                        break;
                    }
                }

                return;
            }

            await message.reply(ctx.t(tt.suggestion_list_help, { prefix: this.controller_prefix }));
            return;
        }

        if (chan_store?.suggestion?.enabled && !this.opt.pass?.(content)) {
            this.debug("checking style", content);

            let replaced = content;
            for (const [key, value] of chan_store.suggestion.list) {
                replaced = replaced.replace(new RegExp(escape_regex(key), "g"), value);
            }

            const slices = (this.opt.pangu === false ? replaced : pangu.spacing(replaced)).split(
                /\s/g,
            );
            slices.forEach((slice, idx) => {
                if (slice in this.sensitive_map) {
                    slices[idx] = this.sensitive_map[slice];
                    return;
                }

                const lower = slice.toLowerCase();
                if (lower in this.map) {
                    slices[idx] = this.map[lower];
                    return;
                }

                if (this.opt.opencc !== false) {
                    slices[idx] = this.cc_converter.convertSync(slices[idx]);
                }
            });

            const parsed = slices.join(" ");
            if (parsed !== content) {
                this.debug("bad style", parsed);
                if (!chan_store.suggestion.force) {
                    await message.reply(`${ctx.t(tt.you_may_want)}\n${parsed}`);
                } else {
                    await message.reply(`<@${message.author.id}>: ${parsed}`);
                    await message.delete();
                }
            } else {
                this.debug("good style");
            }

            return;
        }

        await next();
    }

    private check_rule(key: string, val: string): boolean {
        if (typeof key !== "string" || typeof val !== "string") {
            return false;
        }

        if (!key || key.length > this.custom_list_max_rule_size) {
            return false;
        }

        if (val.length > this.custom_list_max_rule_size) {
            return false;
        }

        return true;
    }
}
