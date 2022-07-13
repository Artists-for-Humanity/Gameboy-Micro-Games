// Add imports for phaser library, scenes, and plugins
import Phaser from "phaser";
import GlobalState from "./GlobalState";
import Emoeowgency from "./8Bitties/Emeowgency";
import MicroGame21 from "./MicroGamers/MicroGame21";
import MicroGame31 from "./Team4/MicroGame31";

// Set configuration for phaser game instance
const config = {
  type: Phaser.AUTO,
  width: 980,
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
  scene: [Emoeowgency],
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
