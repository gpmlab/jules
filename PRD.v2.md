# Product Requirements Document (v2 - Tech Agnostic): 2D Neuroevolution Simulation

## 1. Overview
This application is an interactive simulation that demonstrates neuroevolution. A population of agents (cars) learns to navigate a 2D racetrack using a genetic algorithm to evolve their neural network "brains."

## 2. Core Components & Logic

### 2.1. The Simulation Environment
-   **Canvas**: A rendering canvas where the simulation is displayed.
-   **Racetrack**:
    -   The track should be procedurally generated at the start of each new "run" (i.e., when all agents are eliminated).
    -   It must be a closed loop with inner and outer walls.
    -   The track should contain checkpoints that agents must pass through to increase their fitness score.
-   **Obstacles**:
    -   Red circular obstacles shall be placed randomly along the track.
    -   The number of obstacles should be configurable by the user.

### 2.2. The Agent (Car)
-   **Representation**: Each agent is represented by a simple shape (e.g., a rectangle).
-   **Physics**: Agents have `position`, `velocity`, and `acceleration` vectors. Their movement is updated in each frame of the simulation loop.
-   **Sensing (Vision)**:
    -   Each agent must have a set of forward-facing "rays".
    -   These rays detect the distance to the nearest wall or obstacle within a predefined `SIGHT` distance.
-   **Brain (Neural Network)**:
    -   Each agent has its own neural network.
    -   **Inputs**: The distances detected by each of its vision rays.
    -   **Outputs**: Two values: one for steering angle and one for speed.
-   **State**: An agent can be `active`, `dead` (crashed or timed out), or `finished` (completed the track, though this is a stretch goal).

### 2.3. The Genetic Algorithm
The simulation evolves agents over generations.
-   **Population**: The simulation starts with a fixed-size population of agents (`TOTAL`), each with a randomly initialized neural network.
-   **Fitness**: An agent's fitness is determined by the number of checkpoints it successfully passes through.
-   **Lifecycle**:
    1.  All agents run simultaneously until they either crash into a wall/obstacle or exceed a predefined `LIFESPAN` (timeout).
    2.  When an agent becomes "dead," it is saved to a `savedAgents` pool along with its final fitness score.
-   **Evolution (Next Generation)**:
    1.  Once all agents are dead, the genetic algorithm creates a new generation.
    2.  **Selection**: Parents are selected from the `savedAgents` pool. Agents with higher fitness scores have a higher probability of being chosen.
    3.  **Reproduction**: New agents are created with a copy of a selected parent's neural network brain.
    4.  **Mutation**: The weights of the new agent's brain are slightly and randomly mutated with a given `MUTATION_RATE`.
    5.  The simulation then restarts with the new generation of agents.

## 3. User Interface & Controls (MVP)

### 3.1. Main Visualization
-   **Top-Down View**: The main canvas displays the entire track, all active agents, and all obstacles from a top-down perspective.
-   **Agent Highlighting**: The current best-performing agent should be visually highlighted (e.g., with a different color).

### 3.2. First-Person Visualization
-   A portion of the UI must be dedicated to showing a first-person view from the perspective of the current best agent.
-   This view should render what the agent "sees" through its rays. The distance to objects should be represented by the height and brightness of vertical bars. Obstacles should be rendered in red, and walls in white/gray.

### 3.3. Controls
-   **Speed Slider**: An HTML slider that controls the number of simulation updates per frame, allowing the user to speed up or slow down the simulation.
-   **Save Model**: A button that saves the neural network's architecture and weights in a reloadable format.
-   **Load Model**: File input(s) and a "Load" button to load a previously saved model.
-   **Obstacle Count**: A number input field and a "Done" button to change the number of obstacles on the track.
-   **Dynamic Obstacles**: A toggle button ("Dynamic" / "Static") that makes the red obstacles move slightly within their checkpoint boundaries.

## 4. Key Parameters
The following parameters should be easily configurable:
-   `TOTAL`: The total number of agents in the population.
-   `MUTATION_RATE`: The probability of a weight in a neural network being mutated.
-   `LIFESPAN`: The number of frames an agent can live without hitting a checkpoint before it is considered "dead."
-   `SIGHT`: The maximum distance an agent's rays can see.
