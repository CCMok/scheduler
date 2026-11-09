/** Match nav base path including nested routes; ignore query string. */
export function isNavActive(pathname: string, base: string): boolean {
  const normalized = base.split("?")[0] ?? base;
  return pathname === normalized || pathname.startsWith(`${normalized}/`);
}
