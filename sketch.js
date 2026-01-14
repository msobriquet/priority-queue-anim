//Remember, let is local scope, var is global scope
//Remember, debug small js snippets >>javascript debug terminal and in terminal: node filename.js

let input;
var inputText = "Input any 7 natural numbers (positive integers) with 'Enter' in between.";
let countNodes = 0; //for keyPressed and phase 1
let values = []; //empty array for user input

//button stuff
let button;
let hasButton = false;
let buttonPresses = 0;

//node positions
let nodePos = [[400, 75], [200, 230], [600, 230], [100, 400], [300, 400], [500, 400], [700, 400]];

//to animate heapify
let toSwitch = []; //will always have two vals tho
let arrayChanged = false; //if toSwitch never assigned then nothing moves, so just render it. was using this and realized i couldnt keep track of states

//for nodeSwitch() 
let subtree = [];

let t = 0;
let p = 0;

//for drawCircles() helper functions
let nodes = [];
let redCircles = [];

//case 9 
let lastArrayChanged = false;

//case 13 - for timing the maxHeapify(A, 0) after removing parent
let m = 0;



function setup() {
  createCanvas(1400, 800);

  //create input and place it below canvas
  input = createInput('');
  input.position(302,750);

  textSize(22);
}

function draw() {
   background(250, 200, 60); //to allow text to refresh

  if (buttonPresses > 10) {
    background(211, 124, 234);
  }

  //semi-static stuff
  drawArray();

  drawLines();

  drawNotes();

  drawCircles();

  fill(0, 0, 0); //back to black

  if(!hasButton) {
    fill(0,0,0);
    text(inputText, 75, 740); //prompt user for input until enough nodes
    if (countNodes === 7) { //full nodes now
      input.remove();
      button = createButton("Next");
      button.position(302, 750);
      hasButton = true;
      countNodes = 6; //preparing for last input for insert() (case 15)
    }
  } else { //now button exists, so listen for clicks
    button.mousePressed(pressButton);
  }

}

function pressButton() {
  //for all switch statements
  buttonPresses ++;

  //for parametrization of moving nodes
  t = 0;
  p = 0;

  arrayChanged = false;

  //for case 13
  // startTime = millis();
}


function nodeSwitch(subtree) {
  let parent = subtree[0];
  let lch = subtree[1];
  let rch = subtree[2];

  maxHeapify(values, parent); 

  console.log(arrayChanged);
  console.log(toSwitch);

  if(!arrayChanged) { //dont do any movement
    fill(240, 10, 0); //red now
    circle(nodePos[parent][0], nodePos[parent][1], 75);
    circle(nodePos[lch][0], nodePos[lch][1], 75);
    circle(nodePos[rch][0], nodePos[lch][1], 75);

    fill(0,0,0); //black
    text(values[parent], nodePos[parent][0] - 15, nodePos[parent][1]);
    text(values[lch], nodePos[lch][0] - 15, nodePos[lch][1]);
    text(values[rch], nodePos[rch][0] - 15, nodePos[rch][1]);

    fill(50, 200, 40); //back to green
  } else { 
    let a = toSwitch[0]; //i (parent)
    let b = toSwitch[1]; //largest (child) since i != largest

    //render the node that isnt moving
    if(b != rch) { //if the moving child is not the right child, then render it now
      circle(nodePos[rch][0], nodePos[rch][1], 75);

      fill(0,0,0); //black
      text(values[rch], nodePos[rch][0] - 15, nodePos[rch][1]);
      fill(50, 200, 40); //back to green
    } else {
      circle(nodePos[lch][0], nodePos[lch][1], 75);
      
      fill(0,0,0); //black
      text(values[lch], nodePos[lch][0] - 15, nodePos[lch][1]);
      fill(50, 200, 40); //back to green
    }

    renderSwitch(a,b);
  } 
}  

//version of nodeSwitch without node 6 (values[6] = -1 already, so can assume that function wont want to animate it)
function nodeSwitch13(subtree) {
  let parent = subtree[0];
  let lch = subtree[1];
  let rch = subtree[2];

  maxHeapify(values, parent); 

  if(!arrayChanged) { //dont do any movement
    fill(240, 10, 0); //red now
    circle(nodePos[parent][0], nodePos[parent][1], 75);
    circle(nodePos[lch][0], nodePos[lch][1], 75);
    // circle(nodePos[rch][0], nodePos[lch][1], 75); no node 6

    fill(0,0,0); //black
    text(values[parent], nodePos[parent][0] - 15, nodePos[parent][1]);
    text(values[lch], nodePos[lch][0] - 15, nodePos[lch][1]);
    // text(values[rch], nodePos[rch][0] - 15, nodePos[rch][1]);

    fill(50, 200, 40); //back to green
  } else { 
    let a = toSwitch[0]; //i (parent)
    let b = toSwitch[1]; //largest (child) since i != largest

    //WE KNOW NODE 6 ISNT MOVING BUT WE DONT WANNA SEE HER ANYWAY
    // //render the node that isnt moving 
    // if(b != rch) { //if the moving child is not the right child, then render it now
    //   circle(nodePos[rch][0], nodePos[rch][1], 75);

    //   fill(0,0,0); //black
    //   text(values[rch], nodePos[rch][0] - 15, nodePos[rch][1]);
    //   fill(50, 200, 40); //back to green
    // } else {
    //   circle(nodePos[lch][0], nodePos[lch][1], 75);
      
    //   fill(0,0,0); //black
    //   text(values[lch], nodePos[lch][0] - 15, nodePos[lch][1]);
    //   fill(50, 200, 40); //back to green
    // }

    renderSwitch(a,b);
  } 
}  


function renderSwitch(a, b) { //a is parentNode, b is childNode
  fill(240, 10, 0); //red now

  if(t<= 1) { //top circle moving down and text moving with it
      let x = nodePos[a][0] + (nodePos[b][0] - nodePos[a][0])* t;
      let y = nodePos[a][1] + (nodePos[b][1] - nodePos[a][1])* t;

      circle(x, y, 75);

      fill(0,0,0); //black
      text(values[b], x - 15,y); //already switched val so just use where it will be
      fill(240, 10, 0); //back to red

      t += 0.01;
  } else {
      circle(nodePos[b][0], nodePos[b][1], 75);

      fill(0,0,0); //black
      text(values[b], nodePos[b][0] - 15, nodePos[b][1]);
      fill(240, 10, 0); //red now
  }

  if (p <= 1) { //bottom circle moving up and text moving with it
    let x = nodePos[b][0] + (nodePos[a][0] - nodePos[b][0])* t;
    let y = nodePos[b][1] + (nodePos[a][1] - nodePos[b][1])* t;

    circle(x,y,75);

    fill(0,0,0); //black
    text(values[a], x - 15, y);
    fill(240, 10, 0); //red now

    p += 0.01;
  } else {
    circle(nodePos[a][0], nodePos[a][1], 75);

    fill(0,0,0); //black
    text(values[a], nodePos[a][0] - 15, nodePos[a][1]);
    fill(240, 10, 0); //red now
  }
  fill(50, 200, 40); //back to green
}


function drawCircles() {
  //tree representation
  fill(50, 200, 40); //green

  switch(buttonPresses) {
    case 0:
    case 1:
    case 2:
    case 11:     
      nodes = [0, 1, 2, 3, 4, 5, 6];
      drawStillCircles(nodes); 
      break;
    case 3: //index 2, 5, 6 is red
      redCircles = [2, 5, 6];
      drawColorCircles(redCircles);
      break;
    case 4: 
      nodes = [0, 1, 3, 4];
      drawStillCircles(nodes);

      subtree = [2, 5, 6];
      nodeSwitch(subtree);
      break;
    case 5: //draw all nodes (subtree at i =1 in red)  
      redCircles = [1, 3, 4];
      drawColorCircles(redCircles);
      break;
    case 6: 
      nodes = [0, 2, 5, 6];
      drawStillCircles(nodes);

      subtree = [1, 3, 4];
      nodeSwitch(subtree);
      break;
    case 7:  //draw all nodes (subtree at i =0 in red)  
      redCircles = [0, 1, 2];
      drawColorCircles(redCircles);
      break;
    case 8:
      nodes = [3, 4, 5, 6];
      drawStillCircles(nodes);

      subtree = [0, 1, 2];
      nodeSwitch(subtree);

      lastArrayChanged = arrayChanged;
      break;
    case 9: //"recursive call" (fake) down the tree with largest as parent (HIGHLIGHT)
      console.log(toSwitch);
      if (!lastArrayChanged) { //then last maxHeapify call didn't assign toSwitch, and nothing moved for i=0
        nodes = [0, 1, 2, 3, 4, 5, 6];
        drawStillCircles(nodes);
      } else { //then highlight subtree, depending on which subtree's parent was switched
        if (toSwitch[1] === 1) { //left subtree
          redCircles = [1, 3, 4];
        } else { //toSwitch[1] === 2, right subtree 
          redCircles = [2, 5, 6];
        }
        drawColorCircles(redCircles);
      }
      break;
    case 10: // "recursive call" (NODESWITCH)
      if (!lastArrayChanged) { //then nothing moved for i=0
        nodes = [0, 1, 2, 3, 4, 5, 6];
        drawStillCircles(nodes);
      } else { //order highlighted subtree
        console.log(toSwitch);
        if (toSwitch[1] === 1 || toSwitch[0] === 1) { //left subtree (first time here, will pass first conditional bc. hasnt been reassigned, the will pass 2nd conditional)
          nodes = [0, 2, 5, 6];
          subtree = [1, 3, 4];
        } else { //toSwitch[1] === 2, right subtree 
          nodes = [0, 1, 3, 4];
          subtree = [2, 5, 6];
        }
        drawStillCircles(nodes);
        nodeSwitch(subtree);
      }
      break;
    case 12:
      fill(240, 10, 0); //red now
      circle(nodePos[0][0], nodePos[0][1], 75)

      fill(112, 196, 255); //blue
      circle(nodePos[6][0], nodePos[6][1], 75);

      fill(0,0,0); //black
      text(values[0], nodePos[0][0] - 15, nodePos[0][1]); 
      text(values[6], nodePos[6][0] - 15, nodePos[6][1]); 
      fill(50, 200, 40); //back to green

      nodes = [1, 2, 3, 4, 5];
      drawStillCircles(nodes);
      break;
    case 13: //auto maxHeapify(A, 0), without helper functions cause we can't render last node :(
      if (m <= 2) { //replace parent with last node and remove last node 
        values[0] = values[6];

         fill(112, 196, 255); //blue
        circle(nodePos[0][0], nodePos[0][1], 75);
        fill(0,0,0); //black
        text(values[0], nodePos[0][0] - 15, nodePos[0][1]); 
        fill(50, 200, 40); //back to green

        nodes = [1, 2, 3, 4, 5];
        drawStillCircles(nodes);
      } else if (m <= 4) { //first red highlight (like case 7)
        redCircles = [0, 1, 2];
        drawColorCircles13(redCircles);
      } else if (m <= 6) { //move nodes in top subtree (like case 8)
        nodes = [3, 4, 5];
        drawStillCircles(nodes);

        subtree = [0, 1, 2];
        nodeSwitch(subtree);

        lastArrayChanged = arrayChanged;
      } else if (m <= 8) { //highlight red moved subtree if any (like case 9)
        arrayChanged = false; //need to reset manually

        if (!lastArrayChanged) { //then last maxHeapify call didn't assign toSwitch, and nothing moved for i=0
        nodes = [0, 1, 2, 3, 4, 5];
        drawStillCircles(nodes);
        } else { //then highlight subtree, depending on which subtree's parent was switched
          if (toSwitch[1] === 1) { //left subtree
            redCircles = [1, 3, 4];
          } else { //toSwitch[1] === 2, right subtree 
            redCircles = [2, 5];
          }
          drawColorCircles13(redCircles);
        }
        t = 0; //manually
        p = 0;
      } else if (m <= 10) { //order subtree if needed (case 10)
        if (!lastArrayChanged) { //then nothing moved for i=0
          nodes = [0, 1, 2, 3, 4, 5];
          drawStillCircles(nodes);
        } else { //order highlighted subtree
          if (toSwitch[1] === 1 || toSwitch[0] === 1) { //left subtree (first time here, will pass first conditional bc. hasnt been reassigned, the will pass 2nd conditional)
            nodes = [0, 2, 5];
            subtree = [1, 3, 4];
            nodeSwitch(subtree);
          } else { //toSwitch[1] === 2, right subtree 
            values[6] = -1; 
            nodes = [0, 1, 3, 4];
            subtree = [2, 5, 6];
            nodeSwitch13(subtree);
          }
          drawStillCircles(nodes);
        }
      } else if (m > 10) {
        nodes = [0, 1, 2, 3, 4, 5];
        drawStillCircles(nodes);
      }
      m += 0.015
      break;
    case 14: //extract_max()
      values[6] = -1; //so it is visible as -1
      nodes = [1, 2, 3, 4, 5];
      drawStillCircles(nodes);

      fill(240, 10, 0); //red now
      circle(nodePos[0][0], nodePos[0][1], 75);
      fill(0,0,0); //black
      text(values[0], nodePos[0][0] - 15, nodePos[0][1]); 
      fill(50, 200, 40); //back to green
      break;
    case 15: //insert(p) 
      values[6] = 5;
      nodes = [0, 1, 2, 3, 4, 5, 6];
      drawStillCircles(nodes);
      m = 0;
      // button.remove();
      // inputText = "Input any natural number.";
      // input = createInput('');
      // input.position(302,750);
      break;
    case 16:
      if (m <= 2) { //like case 3
        redCircles = [2, 5, 6];
        drawColorCircles(redCircles);
      } else if (m <= 4) { //like case 4
        nodes = [0, 1, 3, 4];
        drawStillCircles(nodes);

        subtree = [2, 5, 6];
        nodeSwitch(subtree);
      } else if (m <= 6) { //like case 5
        redCircles = [1, 3, 4];
        drawColorCircles(redCircles);
        t = 0; //manually
        p = 0;
      } else if (m <= 8) { //like case 7
        redCircles = [0, 1, 2];
        drawColorCircles(redCircles);
      } else if (m <= 10) { //like case 8
        nodes = [3, 4, 5, 6];
        drawStillCircles(nodes);

        subtree = [0, 1, 2];
        nodeSwitch(subtree);

        lastArrayChanged = arrayChanged;
      } else if (m <= 12) { //highlight red moved subtree if any (like case 9)
        arrayChanged = false; //need to reset manually

        if (!lastArrayChanged) { //then last maxHeapify call didn't assign toSwitch, and nothing moved for i=0
        nodes = [0, 1, 2, 3, 4, 5, 6];
        drawStillCircles(nodes);
        } else { //then highlight subtree, depending on which subtree's parent was switched
          if (toSwitch[1] === 1) { //left subtree
            redCircles = [1, 3, 4];
          } else { //toSwitch[1] === 2, right subtree 
            redCircles = [2, 5, 6];
          }
          drawColorCircles(redCircles);
        }
        t = 0; //manually
        p = 0;
      } else if (m <= 14) { //order subtree if needed (case 10)
        if (!lastArrayChanged) { //then nothing moved for i=0
          nodes = [0, 1, 2, 3, 4, 5, 6];
          drawStillCircles(nodes);
        } else { //order highlighted subtree
          if (toSwitch[1] === 1 || toSwitch[0] === 1) { //left subtree (first time here, will pass first conditional bc. hasnt been reassigned, the will pass 2nd conditional)
            nodes = [0, 2, 5, 6];
            subtree = [1, 3, 4];
            nodeSwitch(subtree);
          } else { //toSwitch[1] === 2, right subtree 
            nodes = [0, 1, 3, 4];
            subtree = [2, 5, 6];
            nodeSwitch(subtree);
          }
          drawStillCircles(nodes);
        }
      } else if (m > 14) {
        nodes = [0, 1, 2, 3, 4, 5, 6];
        drawStillCircles(nodes);
      }
      m += 0.015
      break; 
    case 17:
      break;
  }
  fill(0,0,0); //back to black

}

//helper function for drawCircles
//draws nodes that won't move 
function drawStillCircles(nodes) {
  for (let i = 0; i < nodes.length; i++) {
    circle(nodePos[nodes[i]][0], nodePos[nodes[i]][1], 75);

    fill(0,0,0); //black
    text(values[nodes[i]], nodePos[nodes[i]][0] - 15, nodePos[nodes[i]][1]);
    fill(50, 200, 40); //back to green
  }
}

//helper function for drawCircles
//draws red and green circles 
function drawColorCircles(redCircles) {
  for (let i = 0; i < 7; i++) {
    if (redCircles.includes(i)) {
      fill(240, 10, 0); //red now
      circle(nodePos[i][0], nodePos[i][1], 75);
    } else {
      fill(50, 200, 40); //green
      circle(nodePos[i][0], nodePos[i][1], 75);
    }
  }

  fill(0,0,0);
  for(let i = 0; i < 7; i++) {
    text(values[i], nodePos[i][0] - 15, nodePos[i][1]); 
  }
  fill(50, 200, 40);
}

//version of helper above for case 13 when dont want to render last node
function drawColorCircles13(redCircles) {
  for (let i = 0; i < 6; i++) {
    if (redCircles.includes(i)) {
      fill(240, 10, 0); //red now
      circle(nodePos[i][0], nodePos[i][1], 75);
    } else {
      fill(50, 200, 40); //green
      circle(nodePos[i][0], nodePos[i][1], 75);
    }
  }

  fill(0,0,0);
  for(let i = 0; i < 6; i++) {
    text(values[i], nodePos[i][0] - 15, nodePos[i][1]); 
  }
  fill(50, 200, 40);
}

function drawNotes() {
  //x, y, width, height
  rect(875, 75, 450, 650);

  fill(255, 255, 255); //white
  
  console.log(buttonPresses);
  switch(buttonPresses) { 
    case 0:
      text("Welcome! This interactive animation is intended to demonstrate the relationship between heaps and priority queues. \n \n" + 
        "The green structure above is a binary tree, since every node has at most two children. It is also a complete binary tree, meaning all the layers are full (in this case) except possibly the last. " +
        "Notice the data structure underlying the binary tree is the array below, where each parent at index i has a right child " +
        "at index 2*i + 1 and a left child at index 2*i + 2. \n \n Remember that the circles and lines you see in green are merely a visualization of the array; " +
        "that is where the data is stored, accessed, and manipulated.", 
        900, 100, 375, 600);
      break;
    case 1:
      text("Our binary tree has values now! Good job. \n \n" + 
        "Our new goal is to turn this tree into a MAX HEAP, which means enforcing the max heap property: Each child must be smaller than its parent. " +
        "\n \n buildMaxHeap() is a simple loop that, starting from the lowest rightmost parent of our tree, "
        + "calls another function, called maxHeapify, which treats this parent node as the head of a subtree and enforces the heap property recursively, by switching values in the underlying array all the way down the subtree.", 
        900, 100, 375, 500);
      break;
    case 2: //not displaying for some reason
      text("'A' refers to the underlying array, and 'i' refers to the parent node's index in that array.\n \n" +
        "def buildMaxHeap(): \n \t for i in range(len(A)//2, -1, -1): \n \t A = maxHeapify(A, i) \n" + "\t  return A \n \n" +
        "def MaxHeapify(A, i): \n left = 2*i + 1 \n right = 2*i + 1 \n largest = i \n if left < len(A) & A[left] > A[largest]: \n" +
        "largest = left \n if right < len[A] & A[right] > A[largest]: largest = right \n if largest != i: \n A[i], A[largest] = A[largest], A[i] \n A = Heapify(A, largest) \n \n (This is python code, without tabs.)",
        900, 100, 380, 650);  
      break; 
    case 3: //WORKS! "values" not accessed until this case when it already exists so no problem 
      text(`Notice for the number of nodes in this tree (7, determined by len(A) in the code), buildMaxHeap() first calls maxHeapify() for i = 3, which does not affect the ` + 
        `tree since the node at index 3 is not a parent node. \n \n` +
        `For i = 2, buildMaxHeap() runs maxHeapify() on the subtree such that the node at index 2 is the root. In this case, the root has value ${values[2]}, and the left and right nodes ` + 
        `have values ${values[5]} and ${values[6]} respectively. This subtree is in red now. \n \n (Whenever a subtree is highlighted in red, think about which node, if any, will move.)`,
         900, 100, 375, 500); 
      break;  
    case 4:
      text("If either of the children is bigger than the parent, the largest child is now switching with the parent. (If not, then the subtree is already a heap, and nothing will happen.) \n \n" +
        "You may have noticed that the last line of maxHeapify() calls the function again (recursively) with the largest child as the head (if either of the children are bigger than the parent, " +
        "ie. the heap property doesn't already hold). \n \n In the case of lowest subtrees (like this one) this recursive call does not affect the tree, for the same " +
        "reason we saw when i = 3 (the largest child, if it exists, isn't a parent; it will be a leaf node).",
        900, 100, 375, 600);
      break;
    case 5:
      text("Now the 'for' loop in buildMaxHeap() will run maxHeapify() on i = 1, meaning we will now enforce the heap property on the left subtree " +
        "(where node at index 1 is the root). \n \n This subtree is now in red. ",
        900, 100, 375, 500); 
      break;
    case 6:
      text("Again, if either of the children are bigger than the parent, the largest child is now switching with the parent. \n \n" +
        "Notice this change is also reflected in the underlying array, since that is where the data (values) are actually stored in the code (both my code, and the code of any binary tree). \n \n" +
        "Notice also that if both children are greater than their parent node, but also equal each other, the left child will move (because it is checked first).",
        900, 100, 375, 500);
      break;  
    case 7:
      text("Now it gets interesting! \n \n buildMaxHeap() will now run maxHeapify() (for i = 0) on the 'subtree with parent at index 0' which is the entire tree. \n \n " +
        "Thus, now that recursive line comes in handy! \n \n If the parent of the tree was reordered, that recursive line will call maxHeapify() again, using the largest child (this time guaranteed to be a parent) as the parent, " +
        "just in case ordering the first layer affects the ordering of the subtrees we just ordered in " +
        "the earlier steps.",
        900, 100, 375, 500);
      break;  
    case 8:
      text("Watch the node move again, if the heap property needs to be enforced... \n \n and... \n \n ", 
        900, 100, 375, 500);
      break;  
    case 9:
      text("(For those of you who inputted a tree that's already ordered... I'm gonna take you along for the ride anyway! You're not getting away that easy :P ) \n \n " +
        "Now the subtree whose parent is the original parent of the whole tree (wow that's a mouthful) should be in red! Recall this is " +
      "the subtree that could potentially be out of order now. ",
        900, 100, 375, 500);
      break; 
    case 10:
      text("One last ordering... ",
      900, 100, 375, 500);
      break; 
    case 11:
      text("And our tree is ordered...say hello to your heap! So what now? \n \n" +
        "Remember a queue is an ordered collection of items that follows the FIFO (first-in, first-out) principle, and a priority queue (PQ) is an extension where " +
        "the priority value determines dequeuing order. Notice we now have an array such that we can assume the parent has the max priority value. \n \n" + 
        "...That's exactly what we need in order to implement a priority queue! \n \n  Recall the priority queue API: \n void insert(int priority) \n int max() \n int extract_max() \n \n " +
        "so let's implement these functions!" ,
        900, 100, 375, 600);
      break; 
    case 12:
      text(`Starting with extract_max(p), we must return the max priority value, then remove that element from the PQ. \n \n By heap property, the max will be the parent. We can return its value ` +
        `by accessing the first element of the underlying array (ie. max = ${values[0]}) but how do we remove the parent?? \n \n We replace it with the last element of the array! Then, to ` +
        `maintain the heap property, we can run maxHeapify() on i = 0, which will recursively fix/order the tree, as we saw earlier.`, 
        900, 100, 375, 600);
      break;   
    case 13:
      text("Watch as the parent is replaced by the last node, and the tree is ordered. \n \n (The animation is finished when all the nodes turn green.)", 
        900, 100, 375, 600);
      break;
    case 14:
      text(`Now, max() returns the highest priority without affecting the tree. \n \n In this case, extract_max would return ${values[0]}.`,
        900, 100, 375, 600);
      break; 
    case 15:
      text("Last but not least, insert(p) adds an element to the PQ with priority p. Similar to extract_max(), we must reorder the tree after we add the element (which gets added at the end of the array/at the leftmost bottom of the tree), but this time we have to " +
        "run buildMaxHeap() again, because the potentially unordered node is on the bottom, not the top. \n \n We will use 5 as our new node.",
        900, 100, 375, 600);
      break; 
    case 16:
      text("Watch as buildMaxHeap() runs again, ordering the new node. See if you can remember what will happen next! \n \n (Again, the animation ends when the nodes turn green.)",
        900, 100, 375, 600);
      break;  
    case 17:
      background(255, 139, 157);
      button.remove();
      textSize(32);
      text("Priority Queues are helpful for many algorithms, like Dijsktra's for shortest paths and Prim's for MSTs. \n \n " +
        "Thanks for playing! Feel free to refresh the page and try again. Let me know if you find any bugs :)", 
        200, 300, 900, 500);  
      break;  
  }
  

  fill(0,0,0); //back to black
}

function maxHeapify(values, i) {
  let left = 2*i + 1;
  let right =  2*i + 2;
  let largest = i;
  if (left < values.length && parseInt(values[left]) > parseInt(values[largest])) { //NEED TO CHANGE STRING TO INT -_-
    largest = left;
  }
  if (right < values.length && parseInt(values[right]) > parseInt(values[largest])) {
    largest = right;
  }
  if (largest != i) {
    arrayChanged = true;
    [values[i], values[largest]] = [values[largest], values[i]];
    toSwitch = [i, largest];
    // values = Heapify(values, largest); //dont actually want recursion
  }
}

function drawArray() {
  if (buttonPresses === 13 || buttonPresses === 14) { //this is ugly but i dont see a better way rn
    for (let i = 0; i < 6; i ++) {
      fill(255, 255, 255); //white
      square(225 + (50 * i), 600, 50); //array representation
      fill(0,0,0); //black
      text(`${i}`, 245 + (50 *i), 675);   //array labels
      text(values[i], 240 + (i * 50), 630); //dynamic values in the array 
    }
  } else {
    for (let i = 0; i < 7; i ++) {
      fill(255, 255, 255); //white
      square(225 + (50 * i), 600, 50); //array representation
      fill(0,0,0); //black
      text(`${i}`, 245 + (50 *i), 675);   //array labels
      text(values[i], 240 + (i * 50), 630); //dynamic values in the array 
    }
  }
}

function drawLines() {
  //x of 1st pt, y, x of 2nd pt, y
  strokeWeight(4);
  line(400, 115, 200, 192);
  line(400, 115, 600, 192);
  line(200, 270, 100, 362);
  line(200, 270, 300, 362);
  line(600, 270, 500, 362);
  line(600, 270, 700, 362);
  // line(400, 115, 400, 800); //to center things with
}

function keyPressed() {
  if (countNodes === 7) { //key presses do nothing after your input is locked in... 
    return;
  }
  if (keyCode === 13 && !input.value()) {
    inputText = "Hey... there's no number yet!" 
  }  
  else if (keyCode === 13) { //pressed enter
    if (!(/^[0-9]+$/.test(input.value()))) { //gotta love regex
      inputText = "Wait... That's not a number..."
    } else {
      var count = 6 - countNodes;
      inputText = `Great! ${count} left.`
      values[countNodes] = input.value();
      countNodes ++;
    }
  }
}