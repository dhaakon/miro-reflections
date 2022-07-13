import './App.css';
import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js'
import { debounce } from "debounce";
import { AnimatedGIFLoader } from '@pixi/gif';
import { Loader } from '@pixi/loaders';

Loader.registerPlugin(AnimatedGIFLoader);
let shape;

const createApplication = function(_canvasElement){
  const app = new PIXI.Application({ antialias: true, resizeTo: window, view: _canvasElement });

  app.stage.interactive = true;

  const graphics = new PIXI.Graphics();

  // set a fill and line style
  graphics.beginFill(0xFF3300);
  graphics.lineStyle(10, 0xffd900, 1);

  app.stage.addChild(graphics);


  let count = 0;

  // Just click on the stage to draw random lines
  window.app = app;
 

  app.loader.add('image', 'images/d.gif');
  app.loader.add('image2', 'images/2.gif');
  app.loader.add('image3', 'images/3.gif');
  app.loader.add('bg', 'images/background.jpg');
  app.loader.load((loader, resources) => {
      const image = resources.image.animation
      const image2 = resources.image2.animation
      shape = resources.image3.animation

      console.log(shape)

      const bg = resources.bg
      console.log(resources)
      app.stage.addChild(new PIXI.Sprite(bg.texture));
      app.stage.addChild(image);
      app.stage.addChild(image2);
      app.stage.addChild(shape);
  });

  app.ticker.add(() => {
      count += 0.1;

  });
}
const createShape=()=>{
  // const graphics = new PIXI.Graphics();

  const { innerWidth, innerHeight } = window

  // graphics.lineStyle(Math.random() * 30, Math.random() * 0xFFFFFF, 1);
  // graphics.moveTo(Math.random() * innerWidth, Math.random() * innerHeight);
  // graphics.bezierCurveTo(
  //     Math.random() * innerWidth, Math.random() * innerHeight,
  //     Math.random() * innerWidth, Math.random() * innerHeight,
  //     Math.random() * innerWidth, Math.random() * innerHeight,
  // );
  const a = new PIXI.Sprite(shape.texture);

  a.transform.position.x = innerWidth * Math.random()
  a.transform.position.y = innerHeight * Math.random()
  a.transform.scale.x = a.transform.scale.y = Math.max( 1, Math.random() * 3 );
  // a.transform.rotation.x = a.transform.rotation.y = Math.random() * 360;
  a.tint = Math.random() * 0xffffff
  a.rotation = Math.PI/4 * Math.random();

  window.app.stage.addChild(a)
}

const App = () =>{
  const _canvas = useRef(null)
  let dancer,
      kick;
  // const dancer = new window.Dancer()

  const onDancerLoader = ()=>{
    console.log('Dancer Loaded');
    dancer.play();
    dancer.onceAt( 4, () => {kick.on()} );
  }

  const playButton = function(){
    // console.log('play'); 
    dancer = new window.Dancer();

    dancer.bind('loaded', onDancerLoader)
    dancer.fft( document.getElementById( 'fft' ) )
          .load({src:'/audio/song1', codecs: [ 'mp3' ]});

    kick = dancer.createKick({
      onKick: (mag)=>{
        // console.log('kick ', mag)
        createShape();
        // dancer.pause()
      },
      offKick: (mag)=>{
        // console.log('off kick ', mag)
      },
      threshold:0.0875
    })
  }
  
  const onMounted = function(){
    const _canvasElement = _canvas.current;
    const fft = document.getElementById('fft');
    fft.width = _canvasElement.width = window.innerWidth;
    _canvasElement.height = window.innerHeight;


    createApplication(_canvasElement);
  }

  useEffect(onMounted, [])

  return(
    <div>
      <canvas width={window.innerWidth} height={window.innerHeight} ref={_canvas}></canvas>
      <button onClick={playButton}>play me</button>
      <canvas height="100" width={window.innerWidth}id="fft"></canvas>
    </div>
  )
}
export default App;
