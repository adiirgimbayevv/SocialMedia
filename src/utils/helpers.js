export function timeAgo(ts) {
  const s = (Date.now() - new Date(ts)) / 1000
  if (s < 60)   return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400)return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}
 
export function avatarLetter(name) {
  return (name || '?')[0].toUpperCase()
}
 
export function decodeJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}
 