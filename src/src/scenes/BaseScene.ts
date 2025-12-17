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

  protected player!: Phaser.Physics.Arcade.Sprite;
  protected playerStats: PlayerStats = { hp: 100, cash: 0, ammo: 50, weaponType: 'pistol', heat: 0, reputation: 0 };
  protected currentVehicle: Phaser.Physics.Arcade.Sprite | null = null;
  protected keys!: Phaser.Types.Input.Keyboard.CursorKeys;
  protected touchControls!: any;

  protected tilemap!: Phaser.Tilemaps.Tilemap;
  protected hazeGraphics!: Phaser.GameObjects.Graphics;

  constructor(key: string) {
    super(key);
  }

  preload() {
    this.load.image('city_tiles', 'assets/city_tiles.png');
    this.load.image('player', 'assets/player.png');
    this.load.image('car', 'assets/car.png');
    this.load.image('gang_member', 'assets/gang_member.png');
    this.load.image('police', 'assets/police.png');
    this.load.image('civilian', 'assets/civilian.png');
    this.load.audio('gun_shot', 'assets/gun_shot.mp3');
    this.load.audio('explosion', 'assets/explosion.mp3');
    this.load.audio('ambient_city', 'assets/ambient_city.mp3');
  }

  create() {
    this.cameras.main.setBackgroundColor('#000000');
    this.cameras.main.setZoom(1.2);
    this.cameras.main.setAngle(-5);
    this.cameras.main.setBounds(0, 0, 8000, 6000);

    this.tilemap = this.make.tilemap({ width: 250, height: 187, tileWidth: 32, tileHeight: 32 });
    const tileset = this.tilemap.addTilesetImage('city_tiles');
    const layer = this.tilemap.createBlankLayer('ground', tileset, 0, 0);

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

    this.player = this.physics.add.sprite(400, 300, 'player').setCollideWorldBounds(true);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

    this.keys = this.input.keyboard!.createCursorKeys();
    if (this.scale.isFullscreen || /Mobi|Android/i.test(navigator.userAgent)) {
    }

    this.hazeGraphics = this.add.graphics();

    const ambient = this.sound.add('ambient_city', { loop: true, volume: 0.5 });
    ambient.play();

    this.add.text(10, 10, 'HP: 100', { font: '16px Arial', fill: '#ff0000' }).setScrollFactor(0);

    this.physics.add.collider(this.player, layer!);
  }

  update(time: number, delta: number) {
    this.gangs.evaluate(this.pressure, this.reputation, this.dayNight.isNight);
    this.pressure.recalculate();
    this.police.updateHeat(this.playerStats.heat, this.player);
    this.civilians.propagatePanic(this.pressure);
    this.bosses.checkSpawnConditions(this.pressure, this.gangs);
    if (this.scene.key === 'AdduIslandScene') this.mbh.overrideIfActive(this.police, this.gangs);

    const speed = this.currentVehicle ? 300 : 150;
    const body = this.currentVehicle ? this.currentVehicle.body as Phaser.Physics.Arcade.Body : this.player.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0);
    if (this.keys.left.isDown) body.setVelocityX(-speed);
    if (this.keys.right.isDown) body.setVelocityX(speed);
    if (this.keys.up.isDown) body.setVelocityY(-speed);
    if (this.keys.down.isDown) body.setVelocityY(speed);

    if (this.keys.space.isDown && this.time.now > this.player.getData('lastShot') + 500) {
      this.sound.play('gun_shot');
      this.playerStats.ammo--;
      this.playerStats.heat += 5;
      this.reputation.accumulate(1);
      this.player.setData('lastShot', this.time.now);
    }

    if (this.input.keyboard!.addKey('E').isDown) {
      this.vehicles.stealNearest(this.player, (vehicle) => {
        this.currentVehicle = vehicle;
        this.player.setVisible(false);
      });
    }

    this.hazeGraphics.clear();
    const pressure = this.pressure.getPressure(this.player.x, this.player.y);
    this.hazeGraphics.fillStyle(0xff00ff, pressure / 100 * 0.5);
    this.hazeGraphics.fillRect(0, 0, this.scale.width, this.scale.height).setScrollFactor(0);

    if (this.dayNight.isNight) {
      this.cameras.main.setPostPipeline('Tint');
    }

    if (this.scene.key === 'AdduIslandScene' && this.mbh.isDefeated() && this.playerStats.hp > 0) {
      this.sound.stopAll();
      this.scene.pause();
      this.add.text(this.scale.width / 2, this.scale.height / 2, 'END', { font: '48px Arial' }).setOrigin(0.5);
    }

    if (this.currentVehicle && this.currentVehicle.getData('damage') > 50) {
      this.playerStats.heat += 1;
    }

    if (pressure > 90 && this.scene.key === 'MaleIslandScene') {
      this.pressure.partialReset();
      this.scene.start('HulhumaleIslandScene');
    }
  }
}
