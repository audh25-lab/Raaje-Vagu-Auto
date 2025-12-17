import BaseScene from './BaseScene';

export default class MaleIslandScene extends BaseScene {
  constructor() {
    super('MaleIslandScene');
  }

  create() {
    super.create();
    this.gangs.addGang('Henvari Syndicate', 'A', 0x00ff00);
    this.gangs.addGang('Masuun Crew', 'A', 0xff0000);
  }
}
