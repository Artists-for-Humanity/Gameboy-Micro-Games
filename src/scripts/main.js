// Add imports for phaser library, scenes, and plugins
import Phaser from "phaser";
import GlobalState from "./GlobalState";
import GameOver from "./GameOver";
import Emeowgency from "./8Bitties/Emeowgency";
import ColorLab from "./8Bitties/ColorLab";
import CarPump from "./DebugginDaOpps/CarPump";
import TrashSort from "./DebugginDaOpps/TrashSort";
import phaserJuice from "./phaserJuice.js";
import Cannon from "./DebugginDaOpps/Cannon";
import Lowest from "./TeamInflation/Lowest";
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
import MarcyMunch from "./8Bitties/MarcyMunch";
import CircleJump from "./TeamInflation/CircleJump";
import Factory from "./Fairway/factoryScripts/factoryScenes/Factory";
import HiScoreScene from "./Hi-Score";
import WhereisWilly from "./8Bitties/Where'sWilly.js";
import EndlessCutScreen from "./Team Notateam/newCutScreen.js";
import newCutScreen from "./Team Notateam/newCutScreen.js";
import fruitBasket from "./8Bitties/fruitBasket.js";
import DirtyPig from "./Team Notateam/DirtyPig";

// Set configuration for phaser game instance
const juice = new phaserJuice(this);

const config = {
  type: Phaser.AUTO,
  width: 1080,
  height: 720,
  transparent: false,
  backgroundColor: "black",

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
  input: {
    gamepad: true
  },
  scene: [ 
   DirtyPig, 
   FlySwat,  
    newCutScreen,
    MainMenu,
    // fruitBasket,
    Timer,
    // WhereisWilly,
    // MarcyMunch,
    // SockToss,
    // CarPump,
    // Emeowgency,
    // BetweenSpace,
    // CircleJump,
    // Lowest,
    // Factory, 
    // FrogJump,
    // TugOWar,
    // DrinkPour,
    // Cannon,
    // TrashSort,
    // ColorPasscode,
    // HideFromCat,
    // HitTheButton,
    // ColorLab,
    HiScoreScene,
    GameOver,
  ],
  audio: {
    disableWebAudio: true,
  },

  plugins: {
    global: [{
      key: "GlobalState",
      plugin: GlobalState,
      start: false,
      mapping: "globalState",
    },],
  },
};

// Initialize game instance
new Phaser.Game(config);

