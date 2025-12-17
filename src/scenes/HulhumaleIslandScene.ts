import BaseScene from './BaseScene';

export default class HulhumaleIslandScene extends Phaser.Scene {
  constructor() {
    super('HulhumaleIslandScene');
  }

  create() {
    super.create();
    this.gangs.addGang('Henvari', 'A', 0x00ff00, [], []);
    this.gangs.addGang('Masuun', 'A', 0xff0000, [], []);
    this.gangs.addGang('Vaika', 'A', 0x0000ff, [], []);
    this.gangs.addGang('North Coil', 'A', 0xffff00, [], []);
    this.gangs.addGang('Boru Park', 'B', 0xff00ff, [], []);
    this.gangs.addGang('Dotfall', 'B', 0x00ffff, [], []);
    this.gangs.addGang('Iron Jetty', 'B', 0xffffff, [], []);
    this.gangs.addGang('White Line Group', 'B', 0x808080, [], []);
    this.gangs.addGang('Low Tide', 'C', 0x404040, [], []);
    this.gangs.addGang('Breakwater Boys', 'C', 0xc0c0c0, [], []);
    this.gangs.addGang('Flat Nine', 'C', 0x00ff00, [], []);

    this.pressure.assignTerritories(this.gangs.gangs);
  }
}