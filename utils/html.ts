export const removeHtmlComments = (html: string): string => {
  return html.replace(/<!--.*?-->/g, '')
}
