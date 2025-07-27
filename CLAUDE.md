# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a snake-game project that appears to be in its initial setup phase. The repository currently contains only a README.md file and is a fresh Git repository on the main branch.

## Development Setup

This project does not yet have any build tools, package managers, or development dependencies configured. When implementing the snake game, you'll need to:

1. Determine the appropriate technology stack (HTML/CSS/JavaScript, Python, or other)
2. Set up the necessary build tools and dependencies
3. Implement the core game logic and rendering

## Project Structure

The project is currently minimal with only:
- `README.md` - Project documentation (currently empty)
- `.git/` - Git repository configuration

## Commands

- `npm test` - Run tests using Vitest
- `npm run tscheck` - Type check with TypeScript

## Package Management

**IMPORTANT**: Always use exact versions for dependencies (no ^ or ~ prefixes) to ensure reproducible builds. When adding new dependencies:
1. Install the package: `npm install <package>`
2. Edit package.json to remove version prefixes (^ or ~)
3. Commit both package.json and package-lock.json changes together

## Architecture Notes

This is a greenfield project - the architecture and implementation approach are yet to be determined. Consider the following when implementing:

- Game loop and timing mechanisms
- Rendering system (canvas, DOM manipulation, or terminal-based)
- Input handling for snake movement
- Collision detection and game state management
- Score tracking and game restart functionality