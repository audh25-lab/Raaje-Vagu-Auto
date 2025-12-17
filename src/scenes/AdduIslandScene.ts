import BaseScene from './BaseScene';

export default class AdduIslandScene extends BaseScene {
  constructor() {
    super('AdduIslandScene');
  }

  create() {
    super.create();
    this.gangs.addGang('Son of Salts', 'C', 0x0000ff, [], []);
    this.gangs.addGang('High Paper', 'C', 0xffff00, [], []);
    this.gangs.addGang('6 Beys', 'C', 0xff00ff, [], []);
    this.gangs.addGang('Jo Lians', 'C', 0x00ffff, [], []);
    this.gangs.addGang('Milo Juice City', 'B', 0xffffff, [], []);
    this.gangs.addGang('Xe Pear', 'B', 0x808080, [], []);
    this.gangs.addGang('Chis Wiss', 'B', 0x404040, [], []);
    this.gangs.addGang('4OA Land', 'B', 0xc0c0c0, [], []);
    this.gangs.addGang('Black Ledger', 'B', 0x00ff00, [], []);
    this.gangs.addGang('Lions', 'A', 0xff0000, [], []);
    this.gangs.addGang('East Waste Coats', 'A', 0x0000ff, [], []);
    this.gangs.addGang('Sand Paper', 'A', 0xffff00, [], []);
    this.gangs.addGang('Harbor Authority', 'A', 0xff00ff, [], []);
    this.gangs.addGang('Signal Null', 'A+', 0x00ffff, [], []);
    this.gangs.addGang('MBH', 'S', 0xffffff, [], []);
    this.mbh.activate();
  }
}