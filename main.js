const simulationCanvas = document.getElementById('simulationCanvas');
simulationCanvas.width = 800;
simulationCanvas.height = 600;

const fpvCanvas = document.getElementById('fpvCanvas');
fpvCanvas.width = 300;
fpvCanvas.height = 300;

const simulation = new Simulation(simulationCanvas);

const speedSlider = document.getElementById('speed-slider');
let simulationSpeed = 1;
speedSlider.addEventListener('input', (e) => {
    simulationSpeed = parseInt(e.target.value);
});

const saveBtn = document.getElementById('save-btn');
saveBtn.addEventListener('click', () => {
    const brain = JSON.stringify(simulation.bestAgent.brain);
    const a = document.createElement('a');
    const file = new Blob([brain], {type: 'application/json'});
    a.href = URL.createObjectURL(file);
    a.download = 'bestBrain.json';
    a.click();
});

const loadBtn = document.getElementById('load-btn');
const loadInput = document.getElementById('load-input');
loadBtn.addEventListener('click', () => {
    loadInput.click();
});
loadInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const brain = JSON.parse(event.target.result);
            simulation.agents.forEach(agent => {
                agent.brain = brain;
            });
            // Also apply to the best agent if it's separate
            if(simulation.bestAgent){
                simulation.bestAgent.brain = brain;
            }
        };
        reader.readAsText(file);
    }
});

const obstaclesInput = document.getElementById('obstacles-input');
const obstaclesBtn = document.getElementById('obstacles-btn');
obstaclesBtn.addEventListener('click', () => {
    simulation.numObstacles = parseInt(obstaclesInput.value);
    simulation.obstacles = simulation.generateObstacles();
});

const dynamicObstaclesCheckbox = document.getElementById('dynamic-obstacles');
dynamicObstaclesCheckbox.addEventListener('change', (e) => {
    simulation.dynamicObstacles = e.target.checked;
});


const generationSpan = document.getElementById('generation-span');
const activeAgentsSpan = document.getElementById('active-agents-span');

function animate() {
    for(let i=0; i<simulationSpeed; i++){
        simulation.update();
    }
    simulation.draw();

    generationSpan.innerText = simulation.generation;
    activeAgentsSpan.innerText = simulation.agents.length;

    fpvCanvas.height = 300;
    const fpvCtx = fpvCanvas.getContext('2d');
    if(simulation.bestAgent){
        Visualizer.drawNetwork(fpvCtx, simulation.bestAgent.brain);
    }

    requestAnimationFrame(animate);
}

animate();
