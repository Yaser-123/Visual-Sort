const codeDisplay = document.querySelector('.tab-content .tab-pane.active pre code');
const languageTabs = document.querySelectorAll('#languageTabs a');
let array = [];
let stop = false;
const delayTime = 300;
const delay = ms => new Promise(res => setTimeout(res, ms));

// Language code snippets
const codeSnippets = {
    java: `public void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; n-i-1 > j; j++) {
            if (arr[j] > arr[j+1]) {
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
}`,
    c: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
}`,
    cpp: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
}`,
    python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n-1):
        for j in range(n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]`
};

// Event listener for language tabs
languageTabs.forEach(tab => {
    tab.addEventListener('click', event => {
        const language = event.target.getAttribute('href').substring(1);
        codeDisplay.innerText = codeSnippets[language];
    });
});

// Set the initial code display content
codeDisplay.innerText = codeSnippets.java;

// Function to submit array input
function submit() {
    const input = document.getElementById("array").value;
    array = input.split(" ").map(Number);
    visualizeArray(array);
}

// Function to visualize the array
function visualizeArray(arr) {
    const container = document.getElementById("visualization");
    container.innerHTML = "";
    const maxVal = Math.max(...arr);
    const containerWidth = container.offsetWidth;
    const barWidth = Math.max(30, Math.min(100, containerWidth / arr.length - 2));

    arr.forEach((val, idx) => {
        const barContainer = document.createElement("div");
        barContainer.className = "bar-container";
        barContainer.style.width = `${barWidth}px`;
        barContainer.style.left = `${idx * (barWidth + 2)}px`;

        const label = document.createElement("div");
        label.className = "bar-label";
        label.textContent = val;

        const bar = document.createElement("div");
        bar.className = "bar";
        bar.style.height = `${(val / maxVal) * 300}px`;
        bar.style.width = `${barWidth}px`;
        bar.id = `bar-${idx}`;

        barContainer.appendChild(label);
        barContainer.appendChild(bar);
        container.appendChild(barContainer);
    });
}

// Function to update bars
async function updateBars() {
    const maxVal = Math.max(...array);
    array.forEach((val, idx) => {
        const container = document.getElementById(`bar-${idx}`).parentElement;
        const label = container.querySelector('.bar-label');
        const bar = container.querySelector('.bar');

        label.textContent = val;
        bar.style.height = `${(val / maxVal) * 300}px`;
    });
    await delay(delayTime);
}

// Function to swap array elements
async function swap(i, j) {
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;

    const container1 = document.getElementById(`bar-${i}`).parentElement;
    const container2 = document.getElementById(`bar-${j}`).parentElement;

    const tempLeft = container1.style.left;
    container1.style.left = container2.style.left;
    container2.style.left = tempLeft;

    container1.querySelector('.bar').id = `bar-${j}`;
    container2.querySelector('.bar').id = `bar-${i}`;

    await updateBars();
}

// Bubble Sort algorithm
async function bubbleSort() {
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            if (stop) return;
            document.getElementById(`bar-${j}`).classList.add("comparing");
            document.getElementById(`bar-${j + 1}`).classList.add("comparing");
            await delay(delayTime);
            if (array[j] > array[j + 1]) {
                await swap(j, j + 1);
            }
            document.getElementById(`bar-${j}`).classList.remove("comparing");
            document.getElementById(`bar-${j + 1}`).classList.remove("comparing");
        }
        document.getElementById(`bar-${array.length - i - 1}`).classList.add("sorted");
    }
}

// Function to highlight bars
async function highlightBars(indices, className) {
    indices.forEach(index => {
        document.getElementById(`bar-${index}`).classList.remove("comparing", "sorted");
        if (className) {
            document.getElementById(`bar-${index}`).classList.add(className);
        }
    });
    await delay(delayTime);
}

// Function to update a single bar
async function updateSingleBar(index) {
    const maxVal = Math.max(...array);
    const container = document.getElementById(`bar-${index}`).parentElement;
    const label = container.querySelector('.bar-label');
    const bar = container.querySelector('.bar');

    label.textContent = array[index];
    bar.style.height = `${(array[index] / maxVal) * 300}px`;
    await delay(delayTime);
}

// Function to reset the visualization
function reset() {
    stop = false;
    visualizeArray(array);
}

// Function to handle stop button click
function stopClicked() {
    document.getElementById("resume").disabled = false;
    document.getElementById("reset").disabled = false;
}

// Functions to enable and disable buttons
function disableSubmitButton() {
    document.getElementById("submit").disabled = true;
    document.getElementById("start").disabled = true;
    document.getElementById("resume").disabled = true;
    document.getElementById("reset").disabled = true;
}

function enableSubmitButton() {
    document.getElementById("submit").disabled = false;
    document.getElementById("start").disabled = false;
    document.getElementById("resume").disabled = false;
    document.getElementById("reset").disabled = false;
}

// Function to start the sorting
async function startSort() {
    disableSubmitButton();
    reset();
    const sortMethod = document.getElementById("sortSelect").value;
    switch(sortMethod) {
        case "bubble":
            await bubbleSort();
            break;
        // Add other sorting algorithms here
        // case "selection":
        //     await selectionSort();
        //     break;
        // case "insertion":
        //     await insertionSort();
        //     break;
        // case "merge":
        //     await mergeSortWrapper();
        //     break;
        // case "heap":
        //     await heapSort();
        //     break;
        // case "comb":
        //     await combSort();
        //     break;
        // case "quick":
        //     await quickSort();
        //     break;
    }
    enableSubmitButton();
}

// Function to show a step in the tour
function showStep(step) {
    const tourPopup = document.getElementById("tourPopup");
    const targetElement = document.getElementById(tourSteps[step].target);
    const targetRect = targetElement.getBoundingClientRect();

    let top = targetRect.bottom + 10;
    let left = targetRect.left + targetRect.width / 2 - 150;

    if (left < 10) left = 10;
    if (left + 300 > window.innerWidth) left = window.innerWidth - 310;

    if (top + 200 > window.innerHeight) {
        top = targetRect.top - 210;
        if (top < 10) {
            top = 10;
        }
    }

    top = Math.max(10, Math.min(top, window.innerHeight - 210));

    tourPopup.style.left = `${left}px`;
    tourPopup.style.top = `${top}px`;

    document.getElementById("tourTitle").textContent = tourSteps[step].title;
    document.getElementById("tourDescription").textContent = tourSteps[step].description;

    if (step === tourSteps.length - 1) {
        document.getElementById("tourNext").textContent = "Finish";
    } else {
        document.getElementById("tourNext").textContent = "Next";
    }

    targetElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
}

// Event listener for tour next button
document.getElementById("tourNext").addEventListener("click", () => {
    currentStep++;
    if (currentStep < tourSteps.length) {
        showStep(currentStep);
    } else {
        document.getElementById("tourOverlay").style.display = "none";
        currentStep = 0;
    }
});

// Start the tour when the page loads
window.addEventListener("load", function() {
    loader.style.display = "none";
    startTour();
});

// Event listener for tour skip button
document.getElementById("tourSkip").addEventListener("click", () => {
    document.getElementById("tourOverlay").style.display = "none";
    currentStep = 0;
});

// Loader
var loader = document.getElementById("Loader");
window.addEventListener("load", function() {
    loader.style.display = "none";
});

const description = document.querySelector('.bubble-sort-description');

const bubbleSortAlgorithm = `
1. Start at the beginning of the array.
2. Compare the first two elements.
3. If the first element is greater than the second element, swap them.
4. Move to the next pair of elements, and repeat step 3.
5. Continue this process until the end of the array.
6. The largest element will "bubble up" to its correct position at the end of the array.
7. Repeat the process for the rest of the array, excluding the last sorted elements.
8. Continue until no more swaps are needed.
`;

description.querySelector('pre code.algorithm').innerText = bubbleSortAlgorithm;
$(document).ready(function() {
    $('.dropdown-toggle').dropdown();
  });