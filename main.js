document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.querySelector('.search-box form');
    let lastHighlight = null;

    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchValue = this.querySelector('input[type="search"]').value.trim();
        if (!searchValue) return;

        // Remove previous highlight
        if (lastHighlight) {
            const parent = lastHighlight.parentNode;
            parent.replaceChild(document.createTextNode(lastHighlight.textContent), lastHighlight);
            // Merge adjacent text nodes if needed
            parent.normalize();
            lastHighlight = null;
        }

        // Walk through all text nodes in the body
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node, found = false;
        const regex = new RegExp(searchValue, "i");

        while ((node = walker.nextNode())) {
            if (regex.test(node.nodeValue)) {
                found = true;
                // Split the text node at the match
                const match = node.nodeValue.match(regex)[0];
                const parts = node.nodeValue.split(regex);
                const before = document.createTextNode(parts[0]);
                const highlight = document.createElement('mark');
                highlight.textContent = match;
                highlight.style.background = "#8B5B2B"; // brown color
                highlight.style.color = "#fff";
                const after = document.createTextNode(parts.slice(1).join(regex));

                // Insert the new nodes
                const parent = node.parentNode;
                parent.insertBefore(before, node);
                parent.insertBefore(highlight, node);
                parent.insertBefore(after, node);
                parent.removeChild(node);

                highlight.scrollIntoView({ behavior: "smooth", block: "center" });
                lastHighlight = highlight;
                break;
            }
        }

        if (!found) {
            alert("No match found for: " + searchValue);
        }
    });
});