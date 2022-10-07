import { Bot } from "pure-cat";
import { FileStore } from "pure-cat-store-file";
import { Ignore } from "pure-cat-module-ignore";
import { I18n } from "pure-cat-module-i18n";
import { Suggestion } from "../src";

new Bot()
    .use(new FileStore())
    .use(new Ignore())
    .use(new I18n())
    .use(
        new Suggestion({
            custom_list_max_rule_size: 100,
        }),
    )
    .start()
    .then(() => console.log("Bot started!"));
