import Phaser from 'phaser';

class GlobalState extends Phaser.Plugins.BasePlugin {
  constructor(pluginManager) {
    super(pluginManager);



  }

  test() {
    console.log('Testing this Function');
  }

}

export default GlobalState;