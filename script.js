var c = document.getElementById("Canvas");
var ctx = c.getContext("2d");

var fwWidth, fwHeight;
var VoPhao = [];
var pass = [];

var colors = ['#ff5252', '#ff4081', 'e040fb', '#7c4dff', '#53dff', '#40cdff', '#18ffff', '#64ffda', '#69f0ae', '#b2fff59'];

window.onresize = function() { reset();}
reset();
function reset(){
    fwWidth = window.innerWidth;
    fwHeight = window.innerHeight;
    c.width = fwWidth;
    c.height = fwHeight;
}

function newVo(){
    // var left = (Math.random() > 0.5);
    // var vo = {};
    // vo.x = (1*left);
    // vo.y = 1;
    // vo.xoff = (0.007 + Math.random() * 0.006) * (left ? 1: -1);
    // vo.yoff = 0.007 + Math.random() * 0.006;
    // vo.size = Math.random() * 6 + 3;
    // vo.color = colors[Math.floor(Math.random() * colors.length)];
    // VoPhao.push(vo);
    var vo = {};
    vo.x = Math.random(); 
    vo.y = 1;
    vo.xoff = 0; 
    vo.yoff = 0.015 - Math.random() * 0.006; 
    vo.size = Math.random() * 8 + 2;
    vo.color = colors[Math.floor(Math.random() * colors.length)];
    VoPhao.push(vo);
}
function newPass(vo){
    var pasCount = Math.ceil(Math.pow(vo.size, 2) * Math.PI);

    for(i = 0; i < pasCount; i++){
        var pas = {};
        pas.x = vo.x * fwWidth;
        pas.y = vo.y * fwHeight;
        
        var a = Math.random() * 4;
        var s = Math.random() * 10;

        pas.xoff = s * Math.sin((5 - a) * (Math.PI / 2)) * 1.5;
        pas.yoff = s * Math.sin(a * (Math.PI / 2)) * 1.5;
        pas.size = Math.sqrt(vo.size) * 1.2;
        pas.color = vo.color;

        if ( pass.length < 1000) {
            pass.push(pas);
        }
    }
}
var lastRun = 0;
Run();
function Run(){
    var dt = 1;
    if(lastRun != 0){
        dt = Math.min(50, ( performance.now() - lastRun));
    }
    lastRun = performance.now();
    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.fillRect(0,0,fwWidth,fwHeight);

    if((VoPhao.length < 10) && (Math.random() > 0.99)){
        newVo();
    }
    for (let ix in VoPhao){
        var vo = VoPhao[ix];
        ctx.beginPath();
        ctx.arc(vo.x * fwWidth, vo.y * fwHeight, vo.size, 0, 2 * Math.PI);
        ctx.fillStyle = vo.color;
        ctx.fill();

        vo.x -= vo.xoff;
        vo.y -= vo.yoff;
        vo.xoff -= (vo.xoff * dt * 0.001);
        vo.yoff -= ((vo.yoff + 0.2) * dt * 0.00005);
        
        if (vo.y * fwHeight <= fwHeight * 2 / 3 && vo.yoff < -0.00099){
            newPass(vo);
            VoPhao.splice(ix, 1);
        }
    }

    for(let ix in pass){
        var pas = pass[ix];
        ctx.beginPath();
        ctx.arc(pas.x, pas.y, pas.size, 0, 2 * Math.PI);
        ctx.fillStyle = pas.color;
        ctx.fill();

        pas.x -= pas.xoff;
        pas.y -= pas.yoff;
        pas.xoff -= (pas.xoff * dt * 0.001);
        pas.yoff -= ((pas.yoff + 5) * dt * 0.00005);
        pas.size -= (dt * 0.002 * Math.random());

        if((pas.y > fwHeight) || pas.y < -50 || pas.size <= 0){
            pass.splice(ix, 1);
        }
    }
    requestAnimationFrame(Run);
}