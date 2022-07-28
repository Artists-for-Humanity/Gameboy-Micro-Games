// Add imports for phaser library, scenes, and plugins
import Phaser from "phaser";
import GlobalState from "./GlobalState";
import MicroGame01 from "./8Bitties/MicroGame01";
import MicroGame11 from "./DebugginDaOpps/MicroGame11";
import MicroGame21 from "./MicroGamers/MicroGame21";
import Highest2Lowest from "./TeamInflation/Highest2Lowest";
import FrogJump from "./TeamInflation/FrogJump";
import CircleGame from "./TeamInflation/CircleGame";
import BewteenSpace from "./TeamInflation/BetweenSpace";
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
  scene: [BewteenSpace],
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