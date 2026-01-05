//this follows the video "one formula that demistifies 3d graphics" by Tsoding
let vs, fs; // Declare at top-level (outside frame)
let assetsLoaded = false; // Flag to check if assets are loaded

const SOURCEFILE //= './norm-teapot.js'
//= './cube.js'
= './lowpoly-teapot.js'
// Load assets once
import(SOURCEFILE).then(module => {
    vs = module.vs;
    fs = module.fs;
    assetsLoaded = true;

    // Start the animation loop only after assets are loaded
    frame();
});


const BG = "#EEEEEE"
const FG = "#ff55ff"
const SECONDARYCOLOR = "#000000"
const pointsize = 10

console.log(graphics)

const WIDTH = 200;

graphics.width = 500;
graphics.height = 500;//window.innerHeight;

const ctx = graphics.getContext("2d")
console.log(ctx)

function clear(){
    ctx.fillStyle = BG
    ctx.fillRect(0, 0, graphics.width, graphics.height );
}

//this is doing the "Rendering"
function drawpoint({x, y, opacity = 1}) {
    const s = pointsize * opacity;
    ctx.save(); // Save current state
    ctx.globalAlpha = opacity; // Set opacity
    //console.log(opacity)

    ctx.fillStyle = FG;
    ctx.fillRect(x - s / 2, y - s / 2, s, s);
    ctx.restore(); // Restore state
}

function drawLine(p1, p2) {
    const aveOpa = (p1.opacity + p2.opacity) / 2;
    ctx.save();
    ctx.globalAlpha = aveOpa;
    //console.log(aveOpa);
    ctx.strokeStyle = FG;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineWidth = pointsize * aveOpa;
    ctx.stroke();
    ctx.restore();
}

///translate from normal coords (unit square) to html canvas coordinates?
//PROJECTS the point onto the screen
function screen(p){
    return {
        x: (p.x+1)/2*graphics.width,
        y: (1-(p.y+1)/2)*graphics.height,
        opacity: p.opacity
    }
}
//the "eye" is located at 0
function project ({x,y,z}){

    //console.log((z) )
    return{
        x:x/z,
        y:y/z,
        opacity: Math.min(1, 1/(5*z +1)) //this curve means z of <= 0 -> opacity = 1, and then it gets smaller and
    }
}

function translate_z({x,y,z},dz){
    return {x,y, z:z+dz}
}
//rotates around y axis... sines yay :)
function rotate_xz({x,y,z}, angle){
    //shut up and calculate :)
    const c = Math.cos(angle)
    const s = Math.sin(angle)
    return {
        x: x*c-z*s,
        y,
        z:x*s+z*c,
    }

}

//generalized code with chatgpt:
function linkInputToOutput(inputSelector, outputSelector) {
    const inputElem = document.querySelector(inputSelector);
    const outputElem = document.querySelector(outputSelector);
    if (!inputElem || !outputElem) {
        console.warn("Invalid selectors or elements not found.");
        return null;
    }
    outputElem.textContent = inputElem.value;
    inputElem.addEventListener("input", (e) => {
        outputElem.textContent = e.target.value;
    });
    return inputElem; // You can access.value anytime
}

// Usage:
const zRad = linkInputToOutput("#zRadius", "#zRadiusOut");
const rotSpeed = linkInputToOutput("#rotationSpeed", "#rotationSpeedOut");
/////
const FPS = 24
let t = 0 //moving rotation. starting angle
let angle = 0
function frame( ){
    const dt = 1/FPS

    const zOscilationHeight = zRad.value;
    angle += rotSpeed.value * dt;

    t = t + dt
    const dz =  1 + zOscilationHeight/2 + zOscilationHeight*Math.sin(t);

    //console.log(rotSpeed);
    clear()
    //drawpoint(screen({x:0,y:0})) //centerpoint
    for (const v of vs){
        drawpoint(screen(project( translate_z(rotate_xz(v, angle,), dz ) )));
    }
    for (const f of fs){
        for (let i=0; i<f.length; ++i){
            const a = vs[f[i]];
            const b = vs[f[(i+1)%f.length]];
            drawLine(
                screen(project(translate_z(rotate_xz(a,angle),dz))),
                screen(project(translate_z(rotate_xz(b,angle),dz)))
            )
        }
    }


    setTimeout(frame, 1000/FPS)
}