# ConferenceCall

### Background

This game is about answering the analysts' questions on a conference call by choosing the right visualization to find the answer. The user will be given a sample of a table with many data points that is related to a imaginary company. It is intends to show the possibilities of exploratory analysis.

### Functionality & MVP  

In this game, the user will be able to:

- [ ] view the structure of a table
- [ ] Choose or skip an answer to a question
- [ ] Select columns for x-axis, y-axis and aggregate functions

In addition, this project will include:

- [ ] A production Readme

### Wireframes

This app will consist of a single screen with game status, game controls, and nav links to my Github / LinkedIn.

![wireframes](images/wireframe.png)

### Architecture and Technologies

This project will be implemented with the following technologies:

- Vanilla JavaScript and `jquery` for overall structure and game logic.
- `D3.js` for visualization.
- Webpack to bundle and serve up the various scripts.

### Implementation Timeline

**Day 1**: Setup all necessary Node modules, including getting webpack up and running and `D3.js` installed.  Create `webpack.config.js` as well as `package.json`.  Write a basic entry file and the bare bones of scripts outlined above.  Learn the basics of `D3.js`.  Goals for the day:

- Get a green bundle with `webpack`
- Learn enough `D3.js` to render an object to the `Canvas` element

**Day 2**: Get data ready, including both data table and questions.

**Day 3**: Get D3.js displaying correctly with user interaction.

**Day 4**: Implement the logic of the game.


### Bonus features

There are many directions this cellular automata engine could eventually go.  Some anticipated updates are:

- [ ] More types of visualizations
- [ ] Better graphic