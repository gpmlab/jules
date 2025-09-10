class Simulation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;

        this.trackPoints = [];
        this.walls = [];
        this.checkpoints = [];
        this.trackWidth = 60;

        this.N = 200;
        this.agents = [];
        this.bestAgent = null;
        this.savedAgents = [];
        this.generation = 1;
        this.lifespan = 500;
        this.time = this.lifespan;

        this.numObstacles = 5;
        this.dynamicObstacles = false;

        this.generateTrack();
        this.obstacles = this.generateObstacles();
        this.generateAgents();
    }

    /**
     * Creates a new generation of agents using the genetic algorithm.
     * It selects parents from the saved (dead) agents of the previous generation,
     * creates new agents with mutated brains, and resets the simulation time.
     */
    nextGeneration() {
        if(this.savedAgents.length > 0){
            this.bestAgent = this.savedAgents.reduce((best, agent) => agent.fitness > best.fitness ? agent : best, this.savedAgents[0]);
        }
        this.calculateFitness();
        this.agents = [];
        for (let i = 0; i < this.N; i++) {
            const parent = this.selectParent();
            const newAgent = new Agent(this.startPosition.x, this.startPosition.y, 30, 50);
            if(parent){
                newAgent.brain = JSON.parse(JSON.stringify(parent.brain));
                NeuralNetwork.mutate(newAgent.brain, 0.1);
            }
            this.agents.push(newAgent);
        }
        this.savedAgents = [];
        this.generation++;
        this.time = this.lifespan;
    }

    selectParent() {
        if(this.savedAgents.length === 0) return null;

        const fitnessSum = this.savedAgents.reduce((acc, agent) => acc + agent.fitness, 0);
        if(fitnessSum === 0){
            return this.savedAgents[Math.floor(Math.random() * this.savedAgents.length)];
        }
        let rand = Math.random() * fitnessSum;
        for (const agent of this.savedAgents) {
            rand -= agent.fitness;
            if (rand < 0) {
                return agent;
            }
        }
        // Fallback to the best agent
        return this.savedAgents.reduce((best, agent) => agent.fitness > best.fitness ? agent : best, this.savedAgents[0]);
    }

    calculateFitness() {
        for (const agent of this.savedAgents) {
            // Fitness is based on checkpoints passed
        }
    }

    generateAgents() {
        const startPoint = this.checkpoints[0];
        this.startPosition = {
            x: (startPoint[0].x + startPoint[1].x) / 2,
            y: (startPoint[0].y + startPoint[1].y) / 2,
        };
        this.agents = [];
        for (let i = 1; i <= this.N; i++) {
            this.agents.push(new Agent(this.startPosition.x, this.startPosition.y, 30, 50));
        }
        this.bestAgent = this.agents[0];
    }

    generateObstacles() {
        const obstacles = [];
        for(let i=0; i<this.numObstacles; i++){
            const checkpointIndex = Math.floor(Math.random() * this.checkpoints.length);
            const checkpoint = this.checkpoints[checkpointIndex];
            const x = lerp(checkpoint[0].x, checkpoint[1].x, Math.random());
            const y = lerp(checkpoint[0].y, checkpoint[1].y, Math.random());
            obstacles.push(new Obstacle(x, y, 20, 20));
        }
        return obstacles;
    }

    generateTrack() {
        this.trackPoints = [];
        this.walls = [];
        this.checkpoints = [];
        const numPoints = 10;
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const radius = Math.min(this.width, this.height) * 0.35;

        for (let i = 0; i < numPoints; i++) {
            const angle = (i / numPoints) * Math.PI * 2;
            const r = radius + (Math.random() - 0.5) * radius * 0.5;
            this.trackPoints.push({
                x: centerX + Math.cos(angle) * r,
                y: centerY + Math.sin(angle) * r,
            });
        }
        this.trackPoints.push(this.trackPoints[0]); // Close the loop

        const road = [];
        for (let i = 1; i < this.trackPoints.length; i++) {
            const p1 = this.trackPoints[i - 1];
            const p2 = this.trackPoints[i];

            const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
            const offsetX = Math.sin(angle) * this.trackWidth / 2;
            const offsetY = Math.cos(angle) * this.trackWidth / 2;

            road.push([
                {x: p1.x - offsetX, y: p1.y + offsetY},
                {x: p1.x + offsetX, y: p1.y - offsetY}
            ]);
            road.push([
                {x: p2.x - offsetX, y: p2.y + offsetY},
                {x: p2.x + offsetX, y: p2.y - offsetY}
            ]);
        }

        for(let i=0; i<road.length; i++){
            this.walls.push([
                road[i][0],
                road[(i+1)%road.length][0]
            ]);
            this.walls.push([
                road[i][1],
                road[(i+1)%road.length][1]
            ]);
            this.checkpoints.push([
                road[i][0],
                road[i][1]
            ]);
        }
    }

    update() {
        if (this.time <= 0 || this.agents.length === 0) {
            if(this.agents.length > 0){
                this.savedAgents.push(...this.agents);
                this.agents = [];
            }
            this.nextGeneration();
        }

        this.time--;

        if(this.dynamicObstacles){
            for(let i=0; i<this.obstacles.length; i++){
                this.obstacles[i].x += (Math.random() * 2 - 1) * 0.5;
                this.obstacles[i].y += (Math.random() * 2 - 1) * 0.5;
                this.obstacles[i].polygon = this.obstacles[i].createPolygon();
            }
        }

        const activeAgents = [];
        for(let i=0; i<this.agents.length; i++){
            const agent = this.agents[i];
            agent.update(this.walls, this.obstacles);

            for(let j=0; j<this.checkpoints.length; j++){
                const checkpoint = this.checkpoints[j];
                if(polysIntersect(agent.polygon, [checkpoint[0], checkpoint[1], checkpoint[1], checkpoint[0]])){
                    if(j > agent.fitness){
                        agent.fitness = j;
                        this.time = this.lifespan;
                    }
                }
            }

            let damagedByObstacle = false;
            for(let j=0; j<this.obstacles.length; j++){
                if(polysIntersect(agent.polygon, this.obstacles[j].polygon)){
                    damagedByObstacle = true;
                    break;
                }
            }

            if (agent.damaged || damagedByObstacle) {
                this.savedAgents.push(agent);
            } else {
                activeAgents.push(agent);
            }
        }
        this.agents = activeAgents;

        if(this.agents.length > 0){
            const currentBest = this.agents.reduce((best, agent) => agent.fitness > best.fitness ? agent : best, this.agents[0]);
            if(!this.bestAgent || currentBest.fitness > this.bestAgent.fitness){
                this.bestAgent = currentBest;
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.ctx.save();
        if(this.bestAgent){
            this.ctx.translate(this.width/2-this.bestAgent.x, this.height/2-this.bestAgent.y);
        }

        // Draw road
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = this.trackWidth;
        this.ctx.beginPath();
        const firstPoint = this.checkpoints[0];
        if(firstPoint) {
            const center = {
                x: (firstPoint[0].x + firstPoint[1].x) / 2,
                y: (firstPoint[0].y + firstPoint[1].y) / 2
            }
            this.ctx.moveTo(center.x, center.y);
            for(let i=1; i<this.checkpoints.length; i++){
                const p = this.checkpoints[i];
                const center = {
                    x: (p[0].x + p[1].x) / 2,
                    y: (p[0].y + p[1].y) / 2
                }
                this.ctx.lineTo(center.x, center.y);
            }
        }
        this.ctx.stroke();

        this.walls.forEach(wall => {
            this.ctx.beginPath();
            this.ctx.moveTo(wall[0].x, wall[0].y);
            this.ctx.lineTo(wall[1].x, wall[1].y);
            this.ctx.stroke();
        });

        this.checkpoints.forEach(checkpoint => {
            this.ctx.beginPath();
            this.ctx.moveTo(checkpoint[0].x, checkpoint[0].y);
            this.ctx.lineTo(checkpoint[1].x, checkpoint[1].y);
            this.ctx.stroke();
        });

        for(let i=0; i<this.obstacles.length; i++){
            this.obstacles[i].draw(this.ctx);
        }

        this.ctx.globalAlpha = 0.2;
        for (let i = 0; i < this.agents.length; i++) {
            this.agents[i].draw(this.ctx, "blue");
        }

        if(this.bestAgent){
            this.ctx.globalAlpha = 1;
            this.bestAgent.draw(this.ctx, "blue", true);
        }

        this.ctx.restore();
    }

    animate() {
        for(let i=0; i<10; i++){
            this.update();
        }
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}
