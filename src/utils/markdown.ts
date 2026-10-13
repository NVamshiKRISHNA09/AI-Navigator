function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderInline(text: string): string {
  let result = escapeHtml(text);
  result = result.replace(/`([^`]+)`/g, (_, code) => `<code>${code}</code>`);
  result = result.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  result = result.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  return result;
}

export function renderMarkdown(text: string): string {
  const lines = text.split("\n");
  let html = "";
  let inCodeBlock = false;
  let codeLang = "";
  let codeContent = "";
  let inList = false;
  let listType: "ul" | "ol" = "ul";

  const closeList = () => {
    if (inList) {
      html += `</${listType}>`;
      inList = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim().startsWith("```")) {
      if (!inCodeBlock) {
        closeList();
        inCodeBlock = true;
        codeLang = line.trim().slice(3).trim();
        codeContent = "";
      } else {
        html += `<pre><code class="language-${codeLang}">${escapeHtml(codeContent)}</code></pre>`;
        inCodeBlock = false;
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent += (codeContent ? "\n" : "") + line;
      continue;
    }

    if (/^#{1}\s/.test(line)) {
      closeList();
      html += `<h1>${renderInline(line.replace(/^#\s/, ""))}</h1>`;
    } else if (/^#{2}\s/.test(line)) {
      closeList();
      html += `<h2>${renderInline(line.replace(/^##\s/, ""))}</h2>`;
    } else if (/^#{3}\s/.test(line)) {
      closeList();
      html += `<h3>${renderInline(line.replace(/^###\s/, ""))}</h3>`;
    } else if (/^>\s/.test(line)) {
      closeList();
      html += `<blockquote>${renderInline(line.replace(/^>\s/, ""))}</blockquote>`;
    } else if (/^---+$/.test(line.trim())) {
      closeList();
      html += `<hr/>`;
    } else if (/^\d+\.\s/.test(line)) {
      if (!inList || listType !== "ol") {
        closeList();
        inList = true;
        listType = "ol";
        html += "<ol>";
      }
      html += `<li>${renderInline(line.replace(/^\d+\.\s/, ""))}</li>`;
    } else if (/^[-*]\s/.test(line)) {
      if (!inList || listType !== "ul") {
        closeList();
        inList = true;
        listType = "ul";
        html += "<ul>";
      }
      html += `<li>${renderInline(line.replace(/^[-*]\s/, ""))}</li>`;
    } else if (line.trim() === "") {
      closeList();
    } else {
      closeList();
      html += `<p>${renderInline(line)}</p>`;
    }
  }

  if (inCodeBlock) {
    html += `<pre><code class="language-${codeLang}">${escapeHtml(codeContent)}</code></pre>`;
  }
  closeList();

  return html;
}
