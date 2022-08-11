// Add imports for phaser library, scenes, and plugins
import Phaser from "phaser";
import GlobalState from "./GlobalState";
import Emeowgency from "./8Bitties/Emeowgency";
import ColorLab from "./8Bitties/ColorLab";
import CarPump from "./DebugginDaOpps/CarPump";
import TrashSort from "./DebugginDaOpps/TrashSort";
import Cannon from "./DebugginDaOpps/Cannon";
import Highest2Lowest from "./TeamInflation/Highest2Lowest";
import FrogJump from "./TeamInflation/FrogJump";
import CircleGame from "./TeamInflation/CircleGame";
import BewteenSpace from "./TeamInflation/BetweenSpace";
import ColorPasscode from "./MicroGamers/ColorPasscode";
import HideFromCat from "./MicroGamers/HideFromCat";
import HitTheButton from "./MicroGamers/HitTheButton";
import TugOWar from "./8Bitties/TugOWar";
import FlySwat from "./8Bitties/FlySwat";
import DrinkPour from "./8Bitties/DrinkPour";
import SockToss from "./Team Notateam/socktoss";
import CutScreen from "./Team Notateam/CutScreen";
import MainMenu from "./MainMenu";

// Set configuration for phaser game instance
const config = {
  type: Phaser.AUTO,
  width: 1080,
  height: 720,
  transparent: true,
  // backgroundColor: '#4488aa',

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
  scene: [
    MainMenu,
    Emeowgency,
    ColorLab,
    Highest2Lowest,
    FrogJump,
    CircleGame,
    BewteenSpace,
    ColorPasscode,
    HideFromCat,
    HitTheButton,
    TugOWar,
    FlySwat,
    DrinkPour,
  ],
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
