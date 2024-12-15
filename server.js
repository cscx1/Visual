//debugging statements were used for ajax
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.static('public')); 

app.use(bodyParser.text());
//
//bubble Sort Visualization Endpoint
app.post('/visualize_bubble_sort', (req, res) => {
    console.log("Bubble Sort Request:", req.body); // debugging statement
    try {
        const array = req.body.split(',').map(Number);
        if (array.some(isNaN)) throw new Error("Invalid input");
        const steps = bubbleSort(array);
        res.json({ visualization: steps });
    } catch (error) {
        console.error("Bubble Sort Error:", error.message); // debugging statement
        res.status(400).json({ error: error.message });
    }
});

//Selection Sort Visualization Endpoint
app.post('/visualize_selection_sort', (req, res) => {
    console.log("Selection Sort Request:", req.body); // Debugging statement
    try {
        const array = req.body.split(',').map(Number);
        if (array.some(isNaN)) throw new Error("Invalid input");
        const steps = selectionSort(array);
        res.json({ visualization: steps });
    } catch (error) {
        console.error("Selection Sort Error:", error.message); // debugging statement
        res.status(400).json({ error: error.message });
    }
});

//Binary Search Visualization Endpoint
app.post('/visualize_binary_search', (req, res) => {
    console.log("Binary Search Request:", req.body); //Debugging statement
    try {
        const [data, target] = req.body.split(';');
        const array = data.split(',').map(Number);
        const numericTarget = Number(target);
        if (array.some(isNaN) || isNaN(numericTarget)) throw new Error("Invalid input");
        const steps = binarySearch(array, numericTarget);
        res.json({ visualization: steps });
    } catch (error) {
        console.error("Binary Search Error:", error.message); // debugging statement
        res.status(400).json({ error: error.message });
    }
});

// linked List Visualization Endpoint
app.post('/visualize_linked_list', (req, res) => {
    console.log("Linked List Request:", req.body); //Debugging statement
    try {
        const array = req.body.split(',').map(Number);
        if (array.some(isNaN)) throw new Error("Invalid input");
        const steps = createLinkedList(array);
        res.json({ visualization: steps });
    } catch (error) {
        console.error("Linked List Error:", error.message); //Debugging statement
        res.status(400).json({ error: error.message });
    }
});

// Bubble Sort Visualization Function
function bubbleSort(array) {
    const steps = [];
    const arr = [...array];

    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            steps.push({ array: [...arr], current: [j, j + 1] });

            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
        steps.push({ array: [...arr] });
    }

    return steps;
}

// Selection Sort Visualization Function
function selectionSort(array) {
    const steps = [];
    const arr = [...array];

    for (let i = 0; i < arr.length; i++) {
        let minIndex = i;
        for (let j = i + 1; j < arr.length; j++) {
            steps.push({ array: [...arr], current: [minIndex, j] });

            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        }
        steps.push({ array: [...arr] });
    }

    return steps;
}

// binary Search Visualization Function
function binarySearch(array, target) {
    const steps = [];
    const sortedArray = [...array].sort((a, b) => a - b);
    let left = 0;
    let right = sortedArray.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        steps.push({ array: sortedArray, middle: mid, left, right, target });

        if (sortedArray[mid] === target) {
            steps.push({ array: sortedArray, found: true, index: mid });
            return steps;
        } else if (sortedArray[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    steps.push({ array: sortedArray, found: false });
    return steps;
}

//Linked List Visualization Function
function createLinkedList(array) {
    const steps = [];
    const nodes = array.map(value => ({ value, next: null }));

    // link nodes and add steps for each link creation
    for (let i = 0; i < nodes.length - 1; i++) {
        nodes[i].next = nodes[i + 1];
        steps.push({ nodes: JSON.parse(JSON.stringify(nodes)) });
    }

    steps.push({ nodes });
    return steps;
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
