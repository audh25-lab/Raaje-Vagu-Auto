import Phaser from 'phaser';
import PressureSystem from './PressureSystem';
import GangSystem from './GangSystem';

export default class BossSystem {
  private scene: Phaser.Scene;
  private gangs: GangSystem;

  constructor(scene: Phaser.Scene, gangs: GangSystem) {
    this.scene = scene;
    this.gangs = gangs;
  }

  checkSpawnConditions(pressure: PressureSystem, gangs: GangSystem) {
  }
}