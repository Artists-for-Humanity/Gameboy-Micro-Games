import Phaser from 'phaser';

class GlobalState extends Phaser.Plugins.BasePlugin {
  constructor(pluginManager) {
    super(pluginManager);

  }

  test() {
    console.log(this.game.scene.scenes.length);
    console.log(this.game.scene.scenes[Phaser.Math.Between(0, this.game.scene.scenes.length)].scene.key);
    this.pluginManager.game.scene.start(this.game.scene.scenes[Phaser.Math.Between(0, this.game.scene.scenes.length)])
  }
}

export default GlobalState;