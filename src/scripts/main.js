// Add imports for phaser library, scenes, and plugins
import Phaser from 'phaser';
import MenuScene from './Scenes/MenuScene';
import BunkerScene from './Scenes/BunkerScene';
import GlobalState from './GlobalState';
import MicroGame1 from './8Bitties/MicroGame1';


// Set configuration for phaser game instance
const config = {
  type: Phaser.AUTO,
  width: 1080,
  height: 720,
  backgroundColor: '#808080',

  // Add physics, arcade, scene, and audio
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 0,
      },
      debug: false,
    },
  },
  scene: [MicroGame1],
  audio: {
    disableWebAudio: true,
  },
  plugins: {
    global: [
      {
        key: 'GlobalState',
        plugin: GlobalState,
        start: false,
        mapping: 'globalState'
      }
    ],
  },
};

// Initialize game instance
new Phaser.Game(config);