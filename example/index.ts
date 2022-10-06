import { Bot } from "pure-cat";
import { Ignore } from "pure-cat-module-ignore";
import { I18n } from "pure-cat-module-i18n";
import { Suggestion } from "../src";

new Bot()
    .use(new Ignore())
    .use(new I18n())
    .use(new Suggestion())
    .start()
    .then(() => console.log("Bot started!"));
