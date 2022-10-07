export function escape_md(text: string): string {
    return text.replace(/[*_~\\`]/g, "\\$&");
}

export function escape_regex(text: string): string {
    return text.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
}
