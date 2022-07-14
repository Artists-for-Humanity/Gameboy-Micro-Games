// Add imports for phaser library, scenes, and plugins
import Phaser from "phaser";
import GlobalState from "./GlobalState";
import Emeowgency from "./8Bitties/Emeowgency";
import MicroGame21 from "./MicroGamers/MicroGame21";
import MicroGame31 from "./Team4/MicroGame31";
import ColorLab from "./8Bitties/ColorLab";

// Set configuration for phaser game instance
const config = {
  type: Phaser.AUTO,
  width: 1080,
  height: 720,
  backgroundColor: "#808080",

  // Add physics, arcade, scene, and audio
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 0,
      },
      debug: false,
    },
  },
  scene: [Emeowgency],
  audio: {
    disableWebAudio: true,
  },
  plugins: {
    global: [
      {
        key: "GlobalState",
        plugin: GlobalState,
        start: false,
        mapping: "globalState",
      },
    ],
  },
};

// Initialize game instance
new Phaser.Game(config);
