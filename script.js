$(document).ready(function() {
    $('#algorithmSelect').on('change', function() {
        const isBinarySearch = $(this).val() === 'binary_search';
        $('#targetInput').toggle(isBinarySearch).prop('required', isBinarySearch);
    });

    $('#dataForm').on('submit', function(event) {
        event.preventDefault();

        const data = $('#dataInput').val();
        const algorithm = $('#algorithmSelect').val();

        if (!data.trim()) {
            alert('Please enter valid numbers!');
            return;
        }

        
        let requestData = data;
        if (algorithm === 'binary_search') {
            const target = $('#targetInput').val();
            requestData += ';' + target;
        }

        $.ajax({
            url: `/visualize_${algorithm}`,
            method: 'POST',
            contentType: 'text/plain',
            data: requestData,
            success: function(response) {
                const jsonResponse = response;
                if (Array.isArray(jsonResponse.visualization)) {
                    visualizeData(jsonResponse.visualization, algorithm);
                } else {
                    console.error('Invalid JSON response structure');
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', status, error);
            }
        });
    });

    function visualizeData(steps, algorithm) {
        if (algorithm === 'linked_list') {
            visualizeLinkedList(steps);
        } else if (algorithm === 'binary_search') {
            visualizeBinarySearch(steps);
        } else if (algorithm === 'bubble_sort' || algorithm === 'selection_sort') {
            visualizeSorting(steps);
        }
    }
    

    function visualizeSorting(steps) {
        const svg = d3.select('#visualization').html('').append('svg')
            .attr('width', 800)
            .attr('height', 300);
    
        const barWidth = 40;
        const spacing = 10;
        const startY = 50;
    
        steps.forEach((step, index) => {
            setTimeout(() => {
                svg.selectAll('*').remove(); // clear previous step visuals
    
                svg.selectAll('rect')
                    .data(step.array)
                    .enter()
                    .append('rect')
                    .attr('x', (d, i) => i * (barWidth + spacing))
                    .attr('y', d => startY + (200 - d * 10)) //Adjust height based on value
                    .attr('width', barWidth)
                    .attr('height', d => d * 10) //Scale height based on value
                    .attr('fill', (d, i) => step.current && step.current.includes(i) ? 'red' : 'steelblue');
    
                svg.selectAll('text')
                    .data(step.array)
                    .enter()
                    .append('text')
                    .attr('x', (d, i) => i * (barWidth + spacing) + barWidth / 2)
                    .attr('y', d => startY + (200 - d * 10) - 10) // place text above the bar
                    .attr('text-anchor', 'middle')
                    .text(d => d);
            }, index * 1000);
        });
    }
    

    function visualizeLinkedList(steps) {
        const svg = d3.select('#visualization').html('').append('svg')
            .attr('width', 800)
            .attr('height', Math.max(300, steps.length * 70));
    
        const nodeWidth = 80;
        const nodeHeight = 50;
        const spacing = 100;
        const startX = 50;
        const startY = 100;
    
        svg.append('defs').append('marker')
            .attr('id', 'arrow')
            .attr('viewBox', '0 0 10 10')
            .attr('refX', 5)
            .attr('refY', 5)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('polygon')
            .attr('points', '0,0 10,5 0,10')
            .attr('fill', 'black');
    
        steps.forEach((step, index) => {
            setTimeout(() => {
                const nodes = svg.selectAll('g.node')
                    .data(step.nodes)
                    .enter()
                    .append('g')
                    .attr('class', 'node')
                    .attr('transform', (d, i) => `translate(${startX + i * spacing}, ${startY})`);
    
                // append the main rectangle for each node
                nodes.append('rect')
                    .attr('width', nodeWidth)
                    .attr('height', nodeHeight)
                    .attr('fill', 'steelblue')
                    .attr('stroke', 'black')
                    .attr('stroke-width', 2);
    
                //append the smaller "address" rectangle on the left side of the node
                const addressWidth = nodeWidth * 0.25; // 25% of the node's width
                nodes.append('rect')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('width', addressWidth)
                    .attr('height', nodeHeight)
                    .attr('fill', 'lightgray')
                    .attr('stroke', 'black')
                    .attr('stroke-width', 1);
    
                //Append the "address" text inside the left rectangle, rotated vertically
                nodes.append('text')
                    .attr('x', addressWidth / 2)
                    .attr('y', nodeHeight / 2)
                    .attr('transform', 'rotate(-90)')
                    .attr('text-anchor', 'middle')
                    .attr('fill', 'black')
                    .text('address');
    
                //Append the data (value) inside the main part of the node
                nodes.append('text')
                    .attr('x', nodeWidth / 2)
                    .attr('y', nodeHeight / 2)
                    .attr('text-anchor', 'middle')
                    .attr('fill', 'white')
                    .text(d => d.value);
    
                //add "null" label only to the last node (positioned below it)
                if (index === step.nodes.length - 1) {
                    nodes.append('text')
                        .attr('x', nodeWidth / 2)
                        .attr('y', nodeHeight + 20) // Position "null" below the node
                        .attr('text-anchor', 'middle')
                        .attr('fill', 'black')
                        .text('null');
                }
    
                //Append the arrows to indicate the links between nodes
                if (index > 0) {
                    const x1 = startX + (index - 1) * spacing + nodeWidth;
                    const y1 = startY + nodeHeight / 2;
                    const x2 = startX + index * spacing;
                    const y2 = startY + nodeHeight / 2;
    
                    svg.append('line')
                        .attr('x1', x1)
                        .attr('y1', y1)
                        .attr('x2', x2)
                        .attr('y2', y2)
                        .attr('stroke', 'black')
                        .attr('stroke-width', 2)
                        .attr('marker-end', 'url(#arrow)');
                }
            }, index * 1000);
        });
    }
    
    
    
    
    // binary Search Visualization Function
function binarySearchVisualization(array, target) {
    const steps = [];
    let left = 0;
    let right = array.length - 1;

    //sort the array first (binary search works on sorted arrays)
    array.sort((a, b) => a - b);

    //track steps during the binary search
    while (left <= right) {
        const middle = Math.floor((left + right) / 2);
        steps.push({ 
            array: [...array], 
            left, 
            right, 
            middle, 
            found: array[middle] === target 
        });

        if (array[middle] === target) {
            break;
        } else if (array[middle] < target) {
            left = middle + 1;
        } else {
            right = middle - 1;
        }
    }

    return steps;
}

//function to visualize the binary search process with rectangles
function visualizeBinarySearch(steps, target) {
    const svg = d3.select('#visualization').html('').append('svg')
        .attr('width', 800)
        .attr('height', 300);

    const barWidth = 40;
    const spacing = 10;
    const startY = 50;

    const highlightColor = 'yellow';  //Color for the range being searched
    const currentColor = 'red';       //Color for the current middle element
    const normalColor = 'steelblue';  //Default color for elements
    const foundColor = 'red';         //Color for the found target

    let targetIndex = -1;  //To store the index of the found target

    steps.forEach((step, index) => {
        setTimeout(() => {
            svg.selectAll('*').remove();  // Clear previous step visuals

            // append the array elements as bars (rectangles)
            const bars = svg.selectAll('rect')
                .data(step.array)
                .enter()
                .append('rect')
                .attr('x', (d, i) => i * (barWidth + spacing))
                .attr('y', d => startY + (200 - d * 10)) // Adjust height based on value
                .attr('width', barWidth)
                .attr('height', d => d * 10) // Scale height based on value
                .attr('fill', (d, i) => {
                    if (d === target && step.found) {
                        targetIndex = i;  //store the target index when found
                        return foundColor;  // Keep the found target red
                    }
                    if (i === step.middle) return currentColor;  // Highlight current middle element
                    if (i >= step.left && i <= step.right) return highlightColor; // Highlight search range
                    return normalColor; // default color
                })
                .attr('stroke', 'black')
                .attr('stroke-width', 2);

            //add the number value inside each rectangle
            svg.selectAll('text')
                .data(step.array)
                .enter()
                .append('text')
                .attr('x', (d, i) => i * (barWidth + spacing) + barWidth / 2)
                .attr('y', d => startY + (200 - d * 10) - 10) // Place text above the bar
                .attr('text-anchor', 'middle')
                .text(d => d);

            // if the target is found, label it as "Target"
            if (targetIndex !== -1 && targetIndex === step.middle) {
                svg.append('text')
                    .attr('x', startX + targetIndex * (barWidth + spacing) + barWidth / 2)
                    .attr('y', startY + 200 + 20)  // Position below the bar
                    .attr('text-anchor', 'middle')
                    .attr('fill', 'black')
                    .text('Target');
            }

            //optionally display the left and right bounds for visualization
            if (step.left !== undefined) {
                svg.append('text')
                    .attr('x', startX + step.left * (barWidth + spacing) + barWidth / 2)
                    .attr('y', startY + 220)
                    .attr('text-anchor', 'middle')
                    .attr('fill', 'black')
                    .text('left');
            }
            if (step.right !== undefined) {
                svg.append('text')
                    .attr('x', startX + step.right * (barWidth + spacing) + barWidth / 2)
                    .attr('y', startY + 220)
                    .attr('text-anchor', 'middle')
                    .attr('fill', 'black')
                    .text('right');
            }

        }, index * 1000);  //delay each step to animate
    });
}

     
});
