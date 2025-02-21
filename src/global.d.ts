
declare global {
    const SERVER_PORT:number
    const SERVER_HOST:string
    interface Window {
        SERVER_PORT:number
        SERVER_HOST:string
    }
}
