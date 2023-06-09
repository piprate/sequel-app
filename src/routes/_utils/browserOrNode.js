export const inNode = () => typeof window === 'undefined'
export const inBrowser = () => !inNode()
