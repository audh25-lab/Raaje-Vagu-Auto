import Phaser from 'phaser';

export default class VehicleSystem {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  stealNearest(player: Phaser.Physics.Arcade.Sprite, callback: (v: Phaser.Physics.Arcade.Sprite) => void) {
  }
}