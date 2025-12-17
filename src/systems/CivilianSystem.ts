import Phaser from 'phaser';
import PressureSystem from './PressureSystem';

export default class CivilianSystem {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  propagatePanic(pressure: PressureSystem) {
  }
}