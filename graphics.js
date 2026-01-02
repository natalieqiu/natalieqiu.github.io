//this follows the video "one formula that demistifies 3d graphics" by Tsoding
const BG = "#EEEEEE"
const FG = "#ff55ff"
const SECONDARYCOLOR = "#000000"

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
function drawpoint({x,y}){
    const s = 10; //size of point
    ctx.fillStyle = FG
    ctx.fillRect(x-s/2, y - s/2, s, s);
}

function drawLine(p1,p2){
    ctx.strokeStyle = FG
    ctx.beginPath();
    ctx.moveTo(p1.x,p1.y);
    ctx.lineTo(p2.x,p2.y);
    ctx.stroke()

}

///translate from normal coords (unit square) to html canvas coordinates?
//PROJECTS the point onto the screen
function screen(p){
    return {
        x: (p.x+1)/2*graphics.width,
        y: (1-(p.y+1)/2)*graphics.height,
    }
}
//the "eye" is located at 0
function project ({x,y,z}){
    return{
        x:x/z,
        y:y/z,
    }
}

const FPS = 30
//this is a vertex plane
const vs = [
    {x:0.5,y:0.5,z:0.5},
    {x:-0.5,y:0.5,z:0.5},
    {x:-0.5,y:-0.5,z:0.5},
    {x:0.5,y:-0.5,z:0.5},

    {x:0.5,y:0.5,z:-0.5},
    {x:-0.5,y:0.5,z:-0.5},
    {x:-0.5,y:-0.5,z:-0.5},
    {x:0.5,y:-0.5,z:-0.5},
]
const fs = [
    [0,1,2,3],
    [4,5,6,7],
    [0,4], [1,5],[2,6],[3,7]
]
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

let angle = 0 //moving rotation. starting angle
let dz = 1 //moving translation

function frame(){
    const dt = 1/FPS
  //  dz += 1*dt
    angle += Math.PI*dt;
    clear()
    drawpoint(screen({x:0,y:0})) //centerpoint
    for (const v of vs){
        drawpoint(screen(project( translate_z(rotate_xz(v,angle), dz) )));
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

frame()