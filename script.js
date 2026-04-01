/* PARTÍCULAS NO CANVAS*/

const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    const COLORS = ['#FC0404', '#ffff', '#FFD60A', '#fe4501'];

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 1.5 + 0.3;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.alpha = Math.random() * 0.6 + 0.1;
        this.life = 0;
        this.maxLife = Math.random() * 300 + 200;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        this.life++;
        if (this.life > this.maxLife || this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
      }
      draw() {
        const fade = this.life < 30 ? this.life / 30 : this.life > this.maxLife - 30 ? (this.maxLife - this.life) / 30 : 1;
        ctx.globalAlpha = this.alpha * fade;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Criamos 180 partículas
    for (let i = 0; i < 180; i++) particles.push(new Particle());

    // Loop principal — chamado ~60x por segundo
    function animateParticles() {
      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = 1;
      // Linhas de conexão entre partículas próximas
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 100) {
            ctx.globalAlpha = (1 - dist/100) * 0.08;
            ctx.strokeStyle = particles[i].color;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
        particles[i].update();
        particles[i].draw();
      }
      requestAnimationFrame(animateParticles);
    }
    animateParticles();

    /* ---- CURSOR CUSTOMIZADO ----
       Capturamos a posição do mouse e movemos os divs do cursor
    */
    const cursor = document.getElementById('cursor');
    const dot    = document.getElementById('cursor-dot');
    let mx = 0, my = 0;
 
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
      // Cursor principal segue com leve delay (feito pelo transition no CSS)
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
    });
 
    document.querySelectorAll('button, a, .ep-item, .char-card').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.style.transform = 'translate(-50%,-50%) scale(2)');
      el.addEventListener('mouseleave', () => cursor.style.transform = 'translate(-50%,-50%) scale(1)');
    });
 
    

    