// Add imports for phaser library, scenes, and plugins
import Phaser from "phaser";
import GlobalState from "./GlobalState";
import Emeowgency from "./8Bitties/Emeowgency";
import ColorLab from "./8Bitties/ColorLab";
import MicroGame11 from "./DebugginDaOpps/MicroGame11";
import MicroGame21 from "./MicroGamers/MicroGame21";
import MicroGame31 from "./Team4/MicroGame31";
import TugOWar from "./8Bitties/TugOWar";
import FlySwat from "./8Bitties/FlySwat";
import DrinkPour from "./8Bitties/DrinkPour";
import SockToss from "./Team Notateam/socktoss";
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
  scene: [DrinkPour],
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
