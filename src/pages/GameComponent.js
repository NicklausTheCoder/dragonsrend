import React, { useEffect, useRef } from 'react';
import StartScene from './scenes/StartScene';
import GameOverScene from './scenes/gameover';
import GameScene from './scenes/GameScene';
import StoryPanelScene from './scenes/StorypanelScene';
import tanyaradzwaScene from './scenes/tanyaradzwaScene';
import Phaser from 'phaser';
import UIScene from './scenes/uiscene';
import transitionScene from './scenes/transitionScene';
import storeScene from './scenes/storeScene';
import FinalScene from './scenes/FinalScene';
import victoryScene from './scenes/victoryScene';

const GameComponent = () => {
    const gameRef = useRef(null);

    useEffect(() => {

      

   

        const config = {
            type: Phaser.AUTO,
            width: 400,
            height: 700,
            physics: {
                default: 'arcade',
                arcade: { gravity: { y: 0 } }
            },
            audio: {
   // Keep Web Audio enabled
                noAudio: false,
                contextResume: true // Allow context resuming
            },
        scene: [StartScene,StoryPanelScene,tanyaradzwaScene,storeScene,FinalScene,GameOverScene,victoryScene],
      
            parent: 'game-container' // Matches the div below
        };

        gameRef.current = new Phaser.Game(config);

        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
            }
        };
    }, []); // Empty dependency array means this runs once on mount

    return <div id="game-container" style={{ width: '100%', height: '100%' }} />;
};

export default GameComponent;