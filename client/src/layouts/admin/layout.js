import template from "./template.html?raw";
import { htmlToFragment } from "../../lib/utils.js";

export function AdminLayout() {
    let layout = htmlToFragment(template);
    return layout;
}
