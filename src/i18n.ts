export const t_you_may_want = Symbol("suggestion:you-may-want");
export const t_suggestion_enabled = Symbol("suggestion:enabled");
export const t_suggestion_disabled = Symbol("suggestion:disabled");
export const t_suggestion_force_enabled = Symbol("suggestion:force-enabled");
export const t_suggestion_force_disabled = Symbol("suggestion:force-disabled");

export const t_suggestion_list_add = Symbol("suggestion:list-add");
export const t_suggestion_list_remove = Symbol("suggestion:list-remove");
export const t_suggestion_list_list = Symbol("suggestion:list-list");
export const t_suggestion_list_clear = Symbol("suggestion:list-clear");
export const t_suggestion_list_export = Symbol("suggestion:list-export");
export const t_suggestion_list_import = Symbol("suggestion:list-import");
export const t_suggestion_list_help = Symbol("suggestion:list-help");
export const t_suggestion_list_full = Symbol("suggestion:list-full");
export const t_suggestion_list_entry_too_long = Symbol("suggestion:list-entry-too-long");
export const t_suggestion_list_entry_not_found = Symbol("suggestion:list-entry-not-found");
export const t_suggestion_list_invalid_json = Symbol("suggestion:list-invalid-json");
export const t_suggestion_list_duplicated = Symbol("suggestion:list-duplicated");

/**
 * The translate tokens.
 */
export const tt = {
    you_may_want: t_you_may_want,
    suggestion_enabled: t_suggestion_enabled,
    suggestion_disabled: t_suggestion_disabled,
    suggestion_force_enabled: t_suggestion_force_enabled,
    suggestion_force_disabled: t_suggestion_force_disabled,
    suggestion_list_add: t_suggestion_list_add,
    suggestion_list_remove: t_suggestion_list_remove,
    suggestion_list_list: t_suggestion_list_list,
    suggestion_list_clear: t_suggestion_list_clear,
    suggestion_list_export: t_suggestion_list_export,
    suggestion_list_import: t_suggestion_list_import,
    suggestion_list_help: t_suggestion_list_help,
    suggestion_list_full: t_suggestion_list_full,
    suggestion_list_entry_too_long: t_suggestion_list_entry_too_long,
    suggestion_list_entry_not_found: t_suggestion_list_entry_not_found,
    suggestion_list_invalid_json: t_suggestion_list_invalid_json,
    suggestion_list_duplicated: t_suggestion_list_duplicated,
} as const;

export const i18n_table = {
    en: {
        [tt.you_may_want]: "You may want to say: ",
        [tt.suggestion_enabled]: "Text Style Suggestion is enabled.",
        [tt.suggestion_disabled]: "Text Style Suggestion is disabled.",
        [tt.suggestion_force_enabled]: "WARNING: FORCE mode is enabled.",
        [tt.suggestion_force_disabled]: "FORCE mode is disabled.",
        [tt.suggestion_list_add]: (a: { item: string }): string =>
            `Added ${a.item} to suggestion list.`,
        [tt.suggestion_list_remove]: (a: { item: string }): string =>
            `Removed ${a.item} from suggestion list.`,
        [tt.suggestion_list_list]: `Custom suggestion list: `,
        [tt.suggestion_list_clear]: (a: { size: number }): string =>
            `Cleared suggestion list. ${a.size} items removed.`,
        [tt.suggestion_list_export]: (a: { size: number }): string =>
            `Exported ${a.size} items from suggestion list.`,
        [tt.suggestion_list_import]: (a: { size: number }): string =>
            `Imported ${a.size} items to suggestion list.`,
        [tt.suggestion_list_help]: (a: { prefix: string }): string =>
            [
                `Usage: \`${a.prefix} <on|off|add|remove|list|clear|export|import>\``,
                `\`${a.prefix} <on|off|enable|disable>\`: Enable or disable suggestion in this channel.`,
                `\`${a.prefix} add <bad> => <good>\`: Add a suggestion rule.`,
                `\`${a.prefix} remove <bad>\`: Remove a suggestion rule.`,
                `\`${a.prefix} list\`: List all suggestion rules.`,
                `\`${a.prefix} clear\`: Clear all suggestion rules.`,
                `\`${a.prefix} export\`: Export all suggestion rules as JSON.`,
                `\`${a.prefix} import <json>\`: Import suggestion rules from JSON.`,
            ].join("\n"),
        [tt.suggestion_list_full]: "Custom suggestion list is full.",
        [tt.suggestion_list_entry_too_long]: "Entry is too long.",
        [tt.suggestion_list_entry_not_found]: "Entry not found.",
        [tt.suggestion_list_invalid_json]: "Invalid JSON.",
        [tt.suggestion_list_duplicated]: "Duplicated entry.",
    },
    zh: {
        [tt.you_may_want]: "你是不是想說：",
        [tt.suggestion_enabled]: "已啟用訊息風格建議功能",
        [tt.suggestion_disabled]: "已關閉訊息風格建議功能",
        [tt.suggestion_force_enabled]: "警告：已啟用強制替換模式",
        [tt.suggestion_force_disabled]: "已關閉強制替換模式",
        [tt.suggestion_list_add]: (a: { item: string }): string => `已將 ${a.item} 加入建議清單`,
        [tt.suggestion_list_remove]: (a: { item: string }): string =>
            `已將 ${a.item} 從建議清單移除`,
        [tt.suggestion_list_list]: "自訂建議清單：",
        [tt.suggestion_list_clear]: (a: { size: number }): string =>
            `已清空建議清單，共移除 ${a.size} 項規則`,
        [tt.suggestion_list_export]: (a: { size: number }): string => `已將 ${a.size} 項規則匯出`,
        [tt.suggestion_list_import]: (a: { size: number }): string => `已將 ${a.size} 項規則匯入`,
        [tt.suggestion_list_help]: (a: { prefix: string }): string =>
            [
                `用法：\`${a.prefix} <on|off|add|remove|list|clear|export|import>\``,
                `\`${a.prefix} <on|off|enable|disable>\`：啟用或關閉此頻道的訊息風格建議功能`,
                `\`${a.prefix} add <bad> => <good>\`：新增一個建議規則`,
                `\`${a.prefix} remove <bad>\`：移除一個建議規則`,
                `\`${a.prefix} list\`：列出所有建議規則`,
                `\`${a.prefix} clear\`：清空所有建議規則`,
                `\`${a.prefix} export\`：將所有建議規則匯出為 JSON`,
                `\`${a.prefix} import <json>\`：從 JSON 匯入建議規則`,
            ].join("\n"),
        [tt.suggestion_list_full]: "自訂建議清單已滿",
        [tt.suggestion_list_entry_too_long]: "詞語太長",
        [tt.suggestion_list_entry_not_found]: "詞語規則不存在",
        [tt.suggestion_list_invalid_json]: "無效的 JSON",
        [tt.suggestion_list_duplicated]: "詞語規則重複",
    },
};
