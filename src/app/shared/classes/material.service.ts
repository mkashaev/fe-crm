declare var M;

export class MaterialService {
  static toast(message: string) {
    console.log('Meesage: ', message);
    M.toast({ html: message });
  }
}
