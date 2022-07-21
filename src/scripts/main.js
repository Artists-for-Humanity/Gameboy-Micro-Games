// Add imports for phaser library, scenes, and plugins
import Phaser from "phaser";
import GlobalState from "./GlobalState";
import Emeowgency from "./8Bitties/Emeowgency";
import ColorLab from "./8Bitties/ColorLab";
import MicroGame11 from "./DebugginDaOpps/MicroGame11";
import MicroGame12 from "./DebugginDaOpps/MicroGame12";
import MicroGame21 from "./MicroGamers/MicroGame21";
import MicroGame31 from "./Team4/MicroGame31";
import MainMenu from "./MainMenu";

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
  scene: [MicroGame11, Emeowgency, MicroGame21],
  audio: {
    disableWebAudio: false,
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
