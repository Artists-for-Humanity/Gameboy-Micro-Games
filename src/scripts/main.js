// Add imports for phaser library, scenes, and plugins
import Phaser from "phaser";
import GlobalState from "./GlobalState";
import MicroGame01 from "./8Bitties/MicroGame01";
import MicroGame11 from "./DebugginDaOpps/MicroGame11";
import MicroGame21 from "./MicroGamers/ColorPasscode";
import MicroGame22 from "./MicroGamers/HideFromCat";
import MicroGame31 from "./Team4/MicroGame31";
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
  scene: [MicroGame22],
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