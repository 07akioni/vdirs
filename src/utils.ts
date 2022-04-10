const warnedMessages = new Set()

export function warnOnce(location: string, message: string): void {
  const mergedMessage = `[vdirs/${location}]: ${message}`
  if (warnedMessages.has(mergedMessage)) return
  warnedMessages.add(mergedMessage)
}

export function warn(location: string, message: string): void {
  console.error(`[vdirs/${location}]: ${message}`)
}
