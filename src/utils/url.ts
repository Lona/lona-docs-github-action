export function isInternal(url: string): boolean {
  return /^(\/(?!\/)|\w|\.+\/)/.test(url);
}

// export function cleanupLink(link = "#") {
//   return link.replace(/^\/\//, "/");
// }
