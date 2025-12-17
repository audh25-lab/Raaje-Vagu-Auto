import BaseScene from './BaseScene';

export default class MaleIslandScene extends Phaser.Scene {
  constructor() {
    super('MaleIslandScene');
  }

  create() {
    super.create();
    this.gangs.addGang('Henvari Syndicate', 'A', 0x00ff00, [], []);
    this.gangs.addGang('Masuun Crew', 'A', 0xff0000, [], []);
    this.gangs.addGang('Vaika Circle', 'A', 0x0000ff, ['Henvari Syndicate'], ['Masuun Crew']);
    this.gangs.addGang('North Coil', 'A', 0xffff00, [], []);
    this.gangs.addGang('Bo Snare', 'A', 0xff00ff, [], []);
    this.gangs.addGang('Ell Tee', 'A', 0x00ffff, [], []);
    this.gangs.addGang('Boru Park', 'B', 0xffffff, [], []);
    this.gangs.addGang('Dotfall', 'B', 0x808080, [], []);
    this.gangs.addGang('Brother Foot', 'B', 0x404040, [], []);
    this.gangs.addGang('Iron Jetty', 'B', 0xc0c0c0, [], []);
    this.gangs.addGang('Glass Palm', 'B', 0x00ff00, [], []);
    this.gangs.addGang('Low Tide', 'C', 0xff0000, [], []);
    this.gangs.addGang('Breakwater Boys', 'C', 0x0000ff, [], []);
    this.gangs.addGang('Red Buoy', 'C', 0xffff00, [], []);
    this.gangs.addGang('Anchor Nine', 'C', 0xff00ff, [], []);
    this.gangs.addGang('Concrete Current', 'C', 0x00ffff, [], []);
    this.gangs.addGang('Rust Veins', 'C', 0xffffff, [], []);
    this.gangs.addGang('Night Market Teeth', 'C', 0x808080, [], []);

    this.pressure.assignTerritories(this.gangs.gangs);
  }
}