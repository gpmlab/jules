# High-Level Design & Implementation Guidelines (v2 - Tech Agnostic)

## 1. Core Logical Components
A well-structured application should separate the following concerns into distinct modules, classes, or components.

-   **Simulation Engine / Manager**:
    -   **Responsibility**: The central orchestrator. Manages the main simulation loop, holds the state of the current generation (e.g., `agents`, `savedAgents`), and calls the update methods for all active agents.
    -   **State**: `generationCount`, `agents`, `savedAgents`, `walls`, `obstacles`, `checkpoints`.

-   **Agent Logic**:
    -   **Responsibility**: Encapsulates the properties and behaviors of a single agent.
    -   **Properties**: `position`, `velocity`, `acceleration`, `fitness`, `isDead`, `brain`.
    -   **Methods**: `update()` (physics), `sense()` (ray-casting), `think()` (NN prediction), `evaluateFitness()`.

-   **Neural Network Module**:
    -   **Responsibility**: A wrapper around the chosen ML library.
    -   **Methods**: `predict(inputs)`, `copy()`, `mutate(rate)`. This abstraction allows the ML library to be swapped without changing the agent logic.

-   **Genetic Algorithm Module**:
    -   **Responsibility**: Contains the pure logic for evolution.
    -   **Methods**: `nextGeneration(savedAgents)`, `selection(savedAgents)`, `calculateFitness(savedAgents)`.

-   **Rendering Module / Component**:
    -   **Responsibility**: Handles all drawing to the canvas. It should be given the simulation state and be responsible for rendering it.
    -   **Methods**: `drawTrack(walls)`, `drawAgents(agents)`, `drawObstacles(obstacles)`, `drawFirstPersonView(bestAgent)`.

-   **UI Controls Component**:
    -   **Responsibility**: Manages all user-facing HTML controls and their events. It should communicate changes (e.g., new simulation speed) back to the Simulation Engine.

## 2. Suggested Iterative Development Plan
This plan outlines a logical progression for building the simulation, regardless of the specific tech stack.

1.  **Step 1: Basic Environment Setup**
    -   Set up your chosen framework and build tools.
    -   Create the main application component.
    -   Implement the rendering module to draw a procedurally generated, closed-loop track on a canvas.

2.  **Step 2: Agent and Sensing Logic**
    -   Implement the Agent logic with basic physics (position, velocity).
    -   Implement the ray-casting logic for agent "vision."
    -   Render the agents and their vision rays on the canvas to verify the sensing works correctly.

3.  **Step 3: Neural Network Integration**
    -   Implement the Neural Network module using your chosen library.
    -   Give each agent a `brain`.
    -   Connect the sensing output to the neural network's input.
    -   Use the network's output to control the agent's steering and speed. At this stage, agents will move randomly.

4.  **Step 4: Genetic Algorithm Implementation**
    -   Implement the fitness logic (e.g., passing checkpoints).
    -   Implement the Genetic Algorithm module (`nextGeneration`, `selection`, `mutation`).
    -   In the Simulation Engine, manage the population lifecycle: run until all agents are dead, then create a new generation.

5.  **Step 5: UI and Visualization**
    -   Implement the first-person view component.
    -   Wire up all the UI controls (slider, buttons) to their respective functions in the Simulation Engine.
    -   Implement the logic for saving and loading the neural network models.

## 3. Trade-offs and Considerations
-   **Performance**: This simulation can be computationally intensive. The speed slider is essential for managing performance by controlling how many simulation steps run per rendered frame.
-   **Simplicity over Realism**: The physics are simplified for performance and to make the learning task more manageable for the agents. The focus is on the neuroevolution algorithm, not on creating a realistic driving simulation.
