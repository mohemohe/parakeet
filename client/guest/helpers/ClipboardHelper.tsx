export default class ClipboardHelper {
    public static copyToClipoboard(text: string) {
        if (!window) {
            return "";
        }

        const p = document.createElement("p");
        document.body.appendChild(p);
        p.innerHTML = text;

        let result;
        try {
            const range = document.createRange();
            range.selectNode(p);
            window.getSelection()!.removeAllRanges();
            window.getSelection()!.addRange(range);
            result = document.execCommand("copy");
            window.getSelection()!.removeAllRanges();
        } finally {
            document.body.removeChild(p);
        }
        return result;
    }
}