class RandomGeneratorService {
  create() {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let res = '';
    for (let i = 0; i < 19; i++) {
      res += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return res;
  }
}

module.exports = RandomGeneratorService;