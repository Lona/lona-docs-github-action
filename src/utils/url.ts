/**
 * Returns true for
 * - /foo
 * - ./foo
 * - ../foo
 * - foo
 *
 * and false for
 * - https://foo
 * - http://foo
 * - //foo
 */
export function isInternal(url: string): boolean {
  return /^(?:\.{0,2}\/(?!\/)|(?!https?:\/\/)[\w\d])/.test(url);
}
