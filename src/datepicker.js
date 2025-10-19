export default class Datepicker
{
    canvas;
    ctx;
    player;
    obstacles = [];
    started = false;
    completed = false;         // add this field
    completedMessage = "";     // add this field
    frame = 0;
    gamespeed = 1;
    dateCouter = 0;
    debug = false;
    currentSelector = "day";

    constructor(canvas, dateoutput, options = {})
    {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.sheet = new Image();
        this.imageLoaded = false;
        this.sheet.src = "src/Sprites.jpg";
        this.sheet.onload = () => { this.imageLoaded = true; this.draw(); };

        this.drawPlayer();
        this.draw();
        this.onDateSelected = options.onDateSelected || null;
    }

    sprite = {
        player: { x: 132, y: 280, width: 271, height: 416 },
        background: { x: 538, y: 262, width: 469, height: 500 },
        obstacle: { x: 1123, y: 417, width: 285, height: 289 }
    }

    start()
    {
        this.started = true;
        document.addEventListener("keydown", e => {
            if(e.code === "ArrowUp")
            {
                this.player.y -= 4;
            }
            else if(e.code === "ArrowDown")
            {
                this.player.y += 4;
            }
        });

        const loop = () => {
            if (!this.started) return;
            this.update();
            this.draw();
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);

    }

    drawPlayer()
    {
        const sp = this.sprite.player;
        const displayH = Math.max(40, Math.floor(this.canvas.height * 0.25));
        const displayW = Math.floor(sp.width * displayH / sp.height);
        this.player = {
            x: Math.max(20, Math.floor(this.canvas.width * 0.025)),
            w: displayW,
            h: displayH,
            y: Math.floor((this.canvas.height - displayH) / 2),
            dy: 0,
            gravity: 0.6
        };

    }

    update()
    {
        if (this.completed) return;

        //Check for collision
        for(const obstacle of this.obstacles)
        {
            if(this.checkCollision(this.player, obstacle) && obstacle.collided!=true)
            {
                obstacle.collided = true;
                this.setDate(obstacle.number);
                this.obstacles = [];
                this.dateCouter = 0;
            }
        }

        //add obstacle
        if ((this.frame % 150)/(this.gamespeed*10) === 0) {
            if(this.obstacles[9])
            { this.obstacles = []; this.dateCouter = 0;}

            const top = Math.random() < 0.5;


            const obsSprite = this.sprite.obstacle;
            const displayH = Math.max(24, Math.floor(this.canvas.height * 0.15));
            const displayW = Math.floor(obsSprite.width * displayH / obsSprite.height);


            const groundHeight = 30;
            const y = top ? 0 : (this.canvas.height - groundHeight - displayH);

            this.obstacles.push({
                x: this.canvas.width,
                y: y,
                w: displayW, 
                h: displayH,
                number: this.dateCouter  
            });
            this.dateCouter++;
        }

        this.obstacles.forEach(element => {
            element.x =element.x - this.gamespeed;
        });
       
        this.frame ++;
    }

    draw()
    {
        if (!this.ctx) return;

        //Draw items
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        
        const bg = this.sprite.background;
        this.ctx.drawImage(
            this.sheet,
            bg.x, bg.y, bg.width, bg.height,
            0, 0, this.canvas.width, this.canvas.height 
        );
        
        const s = this.sprite.player;
        if (this.imageLoaded) {
            this.ctx.drawImage(
                this.sheet,
                s.x, s.y, s.width, s.height,
                this.player.x, this.player.y, this.player.w, this.player.h
            );
        } else {
            this.ctx.fillStyle = "red";
            this.ctx.fillRect(this.player.x, this.player.y, this.player.w, this.player.h);
        }
        
        //Obstacles
        const obs = this.sprite.obstacle;
        for (const obstacle of this.obstacles)

        {
            this.ctx.drawImage(
                this.sheet,
                obs.x, obs.y, obs.width, obs.height,         
                obstacle.x, obstacle.y, obstacle.w, obstacle.h
            );
            this.ctx.font = "20px Arial";
            this.ctx.fillStyle = "white"; 
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";
            this.ctx.fillText(
                obstacle.number,
                obstacle.x + obstacle.w / 2,
                obstacle.y + obstacle.h / 2
            );

        }
        //When completed
        if (this.completed) {
            this.ctx.fillStyle = "rgba(0,0,0,0.45)";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.ctx.font = "28px Arial";
            this.ctx.fillStyle = "#fff";
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";
            this.ctx.fillText(this.completedMessage || "Date selected!", this.canvas.width / 2, this.canvas.height / 2);
        }

        if(this.debug)
        {
            this.ctx.save();
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = "lime";
            this.ctx.strokeRect(this.player.x, this.player.y, this.player.w, this.player.h);
            this.ctx.strokeStyle = "red";
            for (const obstacle of this.obstacles) {
                this.ctx.strokeRect(obstacle.x, obstacle.y, obstacle.w, obstacle.h);
            }
            this.ctx.restore();
            }

    }

    checkCollision(a, b) {
        return (
            a.x < b.x + b.w &&
            a.x + a.w > b.x &&
            a.y < b.y + b.h &&
            a.y + a.h > b.y
        );
    }
    stop()
    {
        this.started = false;
        //this.canvas.remove
    }

    setDate(number) {

        if (this.canvas) {
            this.canvas.dispatchEvent(new CustomEvent('date-selected', { detail: { type:this.currentSelector, date: number } }));
        }
    }

    gameCompleted()
    {

        this.completed = true;
        this.completedMessage = "Date Selected!";


        setTimeout(() => {
            this.stop();
            if (this.canvas && this.canvas.parentNode) this.canvas.remove();
        }, 3000);
    }

}