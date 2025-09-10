# Prompt (v2): Build a 2D Neuroevolution Simulation with Full Architectural Freedom

Your task is to build a 2D self-driving car simulation using a neuroevolution algorithm. The goal is to train a population of simple agents (cars) to navigate a racetrack without crashing.

This project is a high-level test of your architectural decision-making, library integration skills, and ability to implement complex algorithms using modern best practices.

**Core Objective:**
First, build a Minimum Viable Product (MVP) that replicates all the core features described in the **Product Requirements Document (`PRD.v2.md`)**. Then, build upon the MVP by implementing features from the "Potential Improvements" section below to showcase your capabilities.

**Technical Stack:**
You have the freedom to choose the most appropriate modern web technologies to build this application. The goal is to create a well-structured, maintainable, and professional-looking simulation.

-   **Core Requirements**:
    -   **Machine Learning**: You must use a suitable **JavaScript-based neural network library** (e.g., TensorFlow.js, Brain.js, etc.) or implement one from scratch. The library must allow for the creation of simple feed-forward networks and provide direct access to the model's weights for mutation. **Do not use external APIs for the agent's decision-making process.**
-   **Framework Choice (Recommended)**:
    -   A modern, component-based framework like **React**, **Vue**, or **Svelte** is highly recommended for structuring the application.
    -   Set up a standard build tool (e.g., Vite, Next.js, Create React App).
-   **Rendering & Visualization**:
    -   Choose a suitable rendering library (e.g., p5.js, Konva.js, Pixi.js) or render directly to an HTML5 Canvas. The choice should integrate well with your chosen framework.
    -   For data visualization (e.g., fitness charts), you should integrate a dedicated charting library (e.g., Chart.js, Recharts, D3).

**Detailed Information:**
-   **Product Requirements Document (`PRD.v2.md`)**: Contains a technology-agnostic breakdown of the simulation's features and logic.
-   **Design & Implementation Plan (`DESIGN.v2.md`)**: Provides high-level, technology-agnostic guidance on the required logical components and an iterative development plan.

**Potential Improvements (To be implemented after the MVP is complete):**
-   **Enhanced UI/UX**:
    -   Improve the visual design of the cars, track, and obstacles using modern styling (e.g., CSS-in-JS, Tailwind CSS).
    -   Add a real-time chart using a suitable library to plot the average and best fitness scores over generations.
    -   Display the current generation number and the number of active agents in a clean, readable UI.
-   **Advanced Simulation Features**:
    -   Implement different types of tracks (e.g., a track with an intersection, a track loaded from a predefined shape).
    -   Add different types of obstacles with varying behaviors.
    -   Introduce a "fuel" or "energy" concept, where agents are rewarded for efficiency.
-   **Better Agent Visualization**:
    -   Clearly highlight the best-performing agent from the previous generation.
    -   Allow the user to click on any agent to see its specific "vision" rays and first-person view.
-   **Code Quality and Documentation**:
    -   Ensure the code is well-structured, modular, and easy to read, following the conventions of your chosen framework.
    -   Add comments where necessary to explain complex parts of the algorithm.

Please generate the complete, runnable codebase based on these instructions.
