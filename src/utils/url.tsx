export function isInternal(url: string): boolean {
  return /^(\/(?!\/)|\w|\.+\/)/.test(url);
}
