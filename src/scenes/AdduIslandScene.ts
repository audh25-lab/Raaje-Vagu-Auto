import BaseScene from './BaseScene';

export default class AdduIslandScene extends BaseScene {
  constructor() {
    super('AdduIslandScene');
  }

  create() {
    super.create();
    this.gangs.addGang('Son of Salts', 'C', 0x0000ff);
    this.gangs.addGang('Milo Juice City', 'B', 0xffff00);
    this.gangs.addGang('Lions', 'A', 0xff00ff);
    this.gangs.addGang('Signal Null', 'A+', 0x00ffff);
    this.gangs.addGang('MBH', 'S', 0xffffff);
    this.mbh.activate();
  }
}
