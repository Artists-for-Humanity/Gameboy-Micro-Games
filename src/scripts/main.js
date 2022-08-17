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
import BetweenSpace from "./TeamInflation/BetweenSpace";
import ColorPasscode from "./MicroGamers/ColorPasscode";
import HideFromCat from "./MicroGamers/HideFromCat";
import HitTheButton from "./MicroGamers/HitTheButton";
import TugOWar from "./8Bitties/TugOWar";
import FlySwat from "./8Bitties/FlySwat";
import DrinkPour from "./8Bitties/DrinkPour";
import SockToss from "./Team Notateam/SockToss";
import CutScreen from "./Team Notateam/CutScreen";
import MainMenu from "./MainMenu";
import Timer from "./Timer";
import Challenge from "./DebugginDaOpps/Challenge";
import BetweenSpace from "./TeamInflation/BetweenSpace";
import CircleJump from "./TeamInflation/CircleJump";


// Set configuration for phaser game instance
const config = {
  type: Phaser.AUTO,
  width: 1080,
  height: 720,
  transparent: false,
  backgroundColor: "#4488aa",

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
    CutScreen,
    Timer,
    SockToss, 
    CarPump, 
    Emeowgency, 
    BetweenSpace, 
    CircleJump, 
    FrogJump, 
    Highest2Lowest, 
    TugOWar, 
    FlySwat, 
    DrinkPour, 
    Cannon, 
    TrashSort, 
    ColorPasscode, 
    HideFromCat, 
    HitTheButton, 
    ColorLab

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
