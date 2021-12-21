export const loading = () => {
  var P = ['\\', '|', '/', '-']
  var x = 0

  const interval = setInterval(() => {
    process.stdout.write('\r' + P[x++])
    x &= 3
  }, 250)
  const clearAnimation = () => {
    clearInterval(interval)
    process.stdout.write('\r' + '')
  }
  return clearAnimation
}
