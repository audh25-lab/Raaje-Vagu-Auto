import Phaser from 'phaser';
import PressureSystem from '../systems/PressureSystem';
import GangSystem from '../systems/GangSystem';
import PoliceSystem from '../systems/PoliceSystem';
import CivilianSystem from '../systems/CivilianSystem';
import VehicleSystem from '../systems/VehicleSystem';
import ShopSafehouseSystem from '../systems/ShopSafehouseSystem';
import ReputationSystem from '../systems/ReputationSystem';
import DayNightSystem from '../systems/DayNightSystem';
import MBHSystem from '../systems/MBHSystem';
import BossSystem from '../systems/BossSystem';
import BulletGroup from '../systems/BulletGroup';

interface PlayerStats {
  hp: number;
  cash: number;
  ammo: number;
  weaponType: string;
  heat: number;
  reputation: number;
}

export default class BaseScene extends Phaser.Scene {
  protected pressure!: PressureSystem;
  protected gangs!: GangSystem;
  protected police!: PoliceSystem;
  protected civilians!: CivilianSystem;
  protected vehicles!: VehicleSystem;
  protected shopsSafehouses!: ShopSafehouseSystem;
  protected reputation!: ReputationSystem;
  protected dayNight!: DayNightSystem;
  protected mbh!: MBHSystem;
  protected bosses!: BossSystem;
  protected bullets!: BulletGroup;

  protected player!: Phaser.Physics.Arcade.Sprite;
  protected playerStats: PlayerStats = { hp: 100, cash: 0, ammo: 50, weaponType: 'pistol', heat: 0, reputation: 0 };
  protected currentVehicle: Phaser.Physics.Arcade.Sprite | null = null;
  protected keys!: Phaser.Types.Input.Keyboard.CursorKeys;
  protected touchPointer!: Phaser.Input.Pointer;

  protected tilemap!: Phaser.Tilemaps.Tilemap;
  protected hazeGraphics!: Phaser.GameObjects.Graphics;
  protected hpText!: Phaser.GameObjects.Text;
  protected ammoText!: Phaser.GameObjects.Text;

  constructor(key: string) {
    super(key);
  }

  preload() {
    this.load.image('city_tiles', 'https://opengameart.org/sites/default/files/Sample_24.png');
    this.load.spritesheet('player', 'https://opengameart.org/sites/default/files/topdownshootercharacters.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('car', 'https://opengameart.org/sites/default/files/car_spritesheet.png', { frameWidth: 64, frameHeight: 32 });
    this.load.spritesheet('gang_member', 'https://opengameart.org/sites/default/files/gangster.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('police', 'https://opengameart.org/sites/default/files/police.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('civilian', 'https://opengameart.org/sites/default/files/civilian.png', { frameWidth: 32, frameHeight: 32 });
    this.load.image('bullet', 'https://www.clipartmax.com/png/middle/331-3318578_bullet-free-icon-gun-bullet-sprite-png.png');
    this.load.image('shop', 'https://img.craftpix.net/2022/04/Buildings-Collection-Top-Down-Pixel-Art2.webp');
    this.load.image('safehouse', 'https://img.craftpix.net/2022/10/Top-Down-Buildings-and-Objects-Pixel-Art2.webp');
    this.load.spritesheet('boss', 'https://img.craftpix.net/2025/10/Free-Top-Down-Boss-Character-4-Direction-Pack4.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('elite', 'https://img.craftpix.net/2025/09/Free-Top-Down-Goblin-Character-Sprite4.png', { frameWidth: 32, frameHeight: 32 });

    this.load.audio('gun_shot', 'https://www.soundjay.com/mechanical/sounds/gun-gunshot-01.mp3');
    this.load.audio('explosion', 'https://www.soundjay.com/mechanical/sounds/explosion-01.mp3');
    this.load.audio('ambient_city', 'https://www.soundjay.com/ambient/sounds/street-traffic-1.mp3');
  }

  create() {
    this.cameras.main.setBackgroundColor('#000000');
    this.cameras.main.setZoom(1.2);
    this.cameras.main.setAngle(-5);
    this.cameras.main.setBounds(0, 0, 8000, 6000);

    this.tilemap = this.make.tilemap({ width: 250, height: 187, tileWidth: 32, tileHeight: 32 });
    const tileset = this.tilemap.addTilesetImage('city_tiles');
    const layer = this.tilemap.createBlankLayer('ground', tileset, 0, 0);
    for (let y = 0; y < this.tilemap.height; y++) {
      for (let x = 0; x < this.tilemap.width; x++) {
        const tileIndex = Phaser.Math.Between(0, tileset.total - 1);
        layer?.putTileAt(tileIndex, x, y);
      }
    }
    layer?.setCollisionByProperty({ collides: true });

    this.pressure = new PressureSystem(8000, 6000, 32);
    this.gangs = new GangSystem(this);
    this.police = new PoliceSystem(this);
    this.civilians = new CivilianSystem(this);
    this.vehicles = new VehicleSystem(this);
    this.shopsSafehouses = new ShopSafehouseSystem(this);
    this.reputation = new ReputationSystem();
    this.dayNight = new DayNightSystem(this);
    this.mbh = new MBHSystem(this);
    this.bosses = new BossSystem(this, this.gangs);
    this.bullets = new BulletGroup(this);

    this.player = this.physics.add.sprite(400, 300, 'player').setCollideWorldBounds(true);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

    this.anims.create({
      key: 'player-walk',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'player-idle',
      frames: [{ key: 'player', frame: 0 }],
      frameRate: 20
    });
    this.anims.create({
      key: 'gang-walk',
      frames: this.anims.generateFrameNumbers('gang_member', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'police-walk',
      frames: this.anims.generateFrameNumbers('police', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'civilian-walk',
      frames: this.anims.generateFrameNumbers('civilian', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'boss-walk',
      frames: this.anims.generateFrameNumbers('boss', { start: 0, end: 7 }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'elite-walk',
      frames: this.anims.generateFrameNumbers('elite', { start: 0, end: 5 }),
      frameRate: 12,
      repeat: -1
    });
    this.anims.create({
      key: 'car-drive',
      frames: this.anims.generateFrameNumbers('car', { start: 0, end: 1 }),
      frameRate: 5,
      repeat: -1
    });

    this.keys = this.input.keyboard!.createCursorKeys();
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.touchPointer = pointer;
    });
    this.input.on('pointerup', () => {
      this.touchPointer = undefined as any;
    });

    this.hazeGraphics = this.add.graphics();

    const ambient = this.sound.add('ambient_city', { loop: true, volume: 0.5 });
    ambient.play();

    this.hpText = this.add.text(10, 10, 'HP: 100', { font: '16px Arial', fill: '#ff0000' }).setScrollFactor(0);
    this.ammoText = this.add.text(10, 30, 'Ammo: 50', { font: '16px Arial', fill: '#00ff00' }).setScrollFactor(0);

    this.physics.add.collider(this.player, layer!);
    this.physics.add.collider(this.bullets, this.gangs.members, (bullet, member) => {
      member.setData('hp', member.getData('hp') - 20);
      if (member.getData('hp') <= 0) member.destroy();
      bullet.destroy();
    });
    this.physics.add.collider(this.bullets, this.police.units, (bullet, unit) => {
      unit.setData('hp', unit.getData('hp') - 20);
      if (unit.getData('hp') <= 0) unit.destroy();
      bullet.destroy();
    });
    this.physics.add.collider(this.bullets, this.civilians.civilians, (bullet, civ) => {
      civ.destroy();
      this.playerStats.heat += 10;
      bullet.destroy();
    });
    this.physics.add.collider(this.bullets, this.mbh.eliteUnits, (bullet, elite) => {
      elite.setData('hp', elite.getData('hp') - 20);
      if (elite.getData('hp') <= 0) elite.destroy();
      bullet.destroy();
    });
  }

  update(time: number, delta: number) {
    this.gangs.evaluate(this.pressure, this.reputation, this.dayNight.isNight);
    this.pressure.recalculate();
    this.police.updateHeat(this.playerStats.heat, this.player);
    this.civilians.propagatePanic(this.pressure, this.player);
    this.bosses.checkSpawnConditions(this.pressure, this.gangs);
    if (this.scene.key === 'AdduIslandScene') this.mbh.overrideIfActive(this.police, this.gangs);
    this.shopsSafehouses.interact(this.player);

    const speed = this.currentVehicle ? 300 : 150;
    const body = this.currentVehicle ? this.currentVehicle.body as Phaser.Physics.Arcade.Body : this.player.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0);

    let dx = 0, dy = 0;
    if (this.keys.left.isDown) dx -= 1;
    if (this.keys.right.isDown) dx += 1;
    if (this.keys.up.isDown) dy -= 1;
    if (this.keys.down.isDown) dy += 1;

    if (this.touchPointer && this.touchPointer.isDown) {
      const touchX = this.touchPointer.x;
      const touchY = this.touchPointer.y;
      const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, touchX, touchY);
      dx = Math.cos(angle);
      dy = Math.sin(angle);
    }

    if (dx !== 0 || dy !== 0) {
      const norm = Math.sqrt(dx * dx + dy * dy);
      body.setVelocity(speed * dx / norm, speed * dy / norm);
      const rotation = Phaser.Math.Angle.Between(0, 0, dx, dy);
      this.player.setRotation(rotation);
      this.player.anims.play('player-walk', true);
      if (this.currentVehicle) {
        this.currentVehicle.setRotation(rotation);
        this.currentVehicle.anims.play('car-drive', true);
      }
    } else {
      this.player.anims.play('player-idle', true);
      if (this.currentVehicle) this.currentVehicle.anims.stop();
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.space) && this.time.now > this.player.getData('lastAction') + 500) {
      this.player.setData('lastAction', this.time.now);
      if (this.playerStats.ammo > 0) {
        this.sound.play('gun_shot');
        this.playerStats.ammo--;
        this.playerStats.heat += 5;
        this.reputation.accumulate(1);
        this.bullets.fireBullet(this.player.x, this.player.y, this.player.rotation);
        this.cameras.main.shake(100, 0.01);
        this.pressure.updatePressure(this.player.x, this.player.y, 10, 'player');
      } else {
        let nearest: Phaser.Physics.Arcade.Sprite | null = null;
        let minDist = Infinity;
        const allEnemies = [...this.gangs.members.getChildren(), ...this.police.units.getChildren(), ...this.mbh.eliteUnits.getChildren()];
        allEnemies.forEach(enemy => {
          const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);
          if (dist < 50 && dist < minDist) {
            minDist = dist;
            nearest = enemy as Phaser.Physics.Arcade.Sprite;
          }
        });
        if (nearest) {
          nearest.setData('hp', nearest.getData('hp') - 30);
          if (nearest.getData('hp') <= 0) nearest.destroy();
          this.playerStats.heat += 3;
          this.reputation.accumulate(0.5);
          this.cameras.main.shake(150, 0.015);
        }
      }
    }

    if (Phaser.Input.Keyboard.JustDown(this.input.keyboard!.addKey('E'))) {
      if (this.currentVehicle) {
        this.player.setPosition(this.currentVehicle.x + 20, this.player.y);
        this.player.setVisible(true);
        this.player.body.enable = true;
        this.currentVehicle = null;
      } else {
        this.vehicles.stealNearest(this.player, (vehicle) => {
          this.currentVehicle = vehicle;
          this.player.setVisible(false);
          this.player.body.enable = false;
        });
      }
    }

    this.hazeGraphics.clear();
    const pressure = this.pressure.getPressure(this.player.x, this.player.y);
    this.hazeGraphics.fillStyle(0xff00ff, pressure / 100 * 0.5);
    this.hazeGraphics.fillRect(0, 0, this.scale.width, this.scale.height).setScrollFactor(0);

    if (this.dayNight.isNight) {
      this.cameras.main.setPipeline('Tint');
    }

    if (this.scene.key === 'AdduIslandScene' && this.mbh.isDefeated() && this.playerStats.hp > 0) {
      this.sound.stopAll();
      this.scene.pause();
      this.add.text(this.scale.width / 2, this.scale.height / 2, 'END', { font: '48px Arial' }).setOrigin(0.5);
    }

    if (this.currentVehicle && this.currentVehicle.getData('damage') > 50) {
      this.playerStats.heat += 1;
    }

    if (pressure > 80 && Math.random() < 0.01) {
      const expX = Phaser.Math.Between(0, 8000);
      const expY = Phaser.Math.Between(0, 6000);
      this.sound.play('explosion');
      this.cameras.main.shake(300, 0.03);
      this.pressure.updatePressure(expX, expY, 20, 'chaos');
    }

    this.hpText.setText(`HP: ${this.playerStats.hp}`);
    this.ammoText.setText(`Ammo: ${this.playerStats.ammo}`);
    if (this.playerStats.hp <= 0) {
      this.scene.pause();
    }

    if (pressure > 90 && this.scene.key === 'MaleIslandScene') {
      this.pressure.partialReset();
      this.scene.start('HulhumaleIslandScene');
    }
    if (pressure > 90 && this.scene.key === 'HulhumaleIslandScene') {
      this.pressure.partialReset();
      this.scene.start('AdduIslandScene');
    }
  }
}