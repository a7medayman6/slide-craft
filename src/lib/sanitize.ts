import DOMPurify from 'dompurify'

export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'strong', 'em', 'b', 'i', 'u', 's', 'del', 'mark',
      'ul', 'ol', 'li',
      'a',
      'img',
      'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
      'pre', 'code',
      'blockquote',
      'div', 'span', 'section', 'article', 'header', 'footer',
      'figure', 'figcaption',
      'details', 'summary',
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'class', 'id',
      'style', 'width', 'height', 'target', 'rel',
      'data-slide', 'colspan', 'rowspan', 'scope',
    ],
    ALLOW_DATA_ATTR: false,
    FORCE_BODY: false,
  })
}
