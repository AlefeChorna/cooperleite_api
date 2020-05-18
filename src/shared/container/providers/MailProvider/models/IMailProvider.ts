export default interface IMailProvider {
  send(to: string, body: string): Promise<void>
}
