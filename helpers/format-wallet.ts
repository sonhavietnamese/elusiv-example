export function formatWallet(str: string, length = 4): string {
  const first = str.slice(0, length)
  const last = str.slice(-length)
  return `${first}....${last}`
}
