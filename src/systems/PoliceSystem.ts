import Phaser from 'phaser';

export default class PoliceSystem {
  private scene: Phaser.Scene;
  private units: Phaser.Physics.Arcade.Group;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.units = this.scene.physics.add.group({ classType: Phaser.Physics.Arcade.Sprite, maxSize: 20 });
    // Animations for police
    this.scene.anims.create({
      key: 'police-walk',
      frames: this.scene.anims.generateFrameNumbers('police', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
  }

  updateHeat(heat: number, player: Phaser.Physics.Arcade.Sprite) {
    const level = Math.floor(heat / 20);
    for (let i = this.units.getLength(); i < level; i++) {
      const unit = this.units.getFirstDead(true, Phaser.Math.Between(0, 8000), Phaser.Math.Between(0, 6000), 'police') as Phaser.Physics.Arcade.Sprite;
      unit.setData('hp', 100);
      this.scene.physics.moveToObject(unit, player, 200);
      this.scene.time.addEvent({ delay: 500, callback: () => {
        this.scene.physics.moveToObject(unit, player, 200);
        unit.anims.play('police-walk', true); // Play chase animation
      }, loop: true });
    }

    if (heat < 5) {
      this.scene.time.delayedCall(10000, () => {
        this.units.getChildren().forEach(u => u.destroy());
      });
    }

    this.scene.physics.add.collider(this.units, player, () => {
      this.scene['playerStats'].hp -= 10;
      if (this.scene['playerStats'].hp <= 0) {
        this.scene.scene.pause();
      }
    });
  }
}