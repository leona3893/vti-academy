export async function delay(ms: number) {
  return new Promise(ok => setTimeout(ok, ms))
}
