export function isInternal(url: string): boolean {
  return /^(?:\.{0,2}\/(?!\/)|(?!https?:\/\/)[\w\d])/.test(url);
}
