
window.onload = function() {
    let chartCanvas = document.getElementById('chartCanvas').getContext('2d');
    let chart;
    let labelArray;
    let titleArray;

    let config = {
        type: "radar",
        data: {
            datasets: [
                {
                    label: 'Intensity'
                },
                {
                    label: 'Relevance',
                    backgroundColor: 'rgba(0,0,128,0.2)',
                    pointBackgroundColor: 'rgba(0,0,128,0.9)',
                    borderWidth:2,
                    borderColor:'rgba(0,0,128,0.5)',
                    hoverBackgroundColor:'rgba(0,0,128,0.3)',
                    hoverBorderColor:'rgba(0,0,128,0.7)'
                },
                {
                    label: 'Likelihood',
                    backgroundColor: 'rgba(128,0,0,0.2)',
                    borderWidth:2,
                    borderColor: 'rgb(128,0,0,0.5)',
                    pointBackgroundColor: 'rgb(128,0,0,0.9)'
                }
            ]
        },
        options: {
            legend: {
                position: 'left',
                labels: {
                    fontColor: "Black",
                    fontSize: 20
                }},
        }
    };


    let createChart = function () {
        let label = document.getElementById('labelList').value;
        let intensityArray = [];
        let relevanceArray = [];
        let likelihoodArray = [];
        labelArray = [];
        titleArray = [];

        $.getJSON("jsondata.json", function (data) {

            data.forEach(function (element) {
                if ((labelArray.includes(element[label]) === false) && (element[label] !== "")) {
                    let intensity = [];
                    let relevance = [];
                    let likelihood = [];

                    labelArray.push(element[label]);
                    data.forEach(function (ele) {
                        if (ele[label] === element[label]) {
                            if (ele.intensity != '')
                                intensity.push(ele.intensity);
                            if (ele.relevance != '')
                                relevance.push(ele.relevance);
                            if (ele.likelihood != '')
                                likelihood.push(ele.likelihood);
                        }
                    });
                    intensityArray.push(intensity.reduce((a, b) => a + b, 0) / intensity.length);
                    relevanceArray.push(relevance.reduce((a, b) => a + b, 0) / relevance.length);
                    likelihoodArray.push(likelihood.reduce((a, b) => a + b, 0) / likelihood.length);
                    titleArray.push(element.title);
                }
            });

            config.data.datasets[0].data = intensityArray;
            config.data.datasets[1].data = relevanceArray;
            config.data.datasets[2].data = likelihoodArray;
            config.data.labels = labelArray;

            document.getElementById('canvasContainer').innerHTML = `<canvas id="chartCanvas" onclick="displayData(event)"></canvas>`;
            chartCanvas = document.getElementById('chartCanvas').getContext('2d');
            chart = new Chart(chartCanvas, config);

            let labelCamel = label.charAt(0).toUpperCase() + label  .slice(1);

            document.getElementById('subLabelList').innerHTML = '';

            document.getElementById('subLabelList').insertAdjacentHTML('afterbegin', `<h3 class="card=title">${labelCamel}</h3><select id="options" onchange="createMiniChart()"><option value="All" selected="selected">All</option></select>`);

            labelArray.forEach(function(element){
                document.getElementById('options').insertAdjacentHTML('beforeend',`<option value="${element}">${element}</option>`);

            });


        });
    };

    createChart();

    function displayData(ev) {
        var point = chart.getElementsAtEvent(ev);
        console.log(labelArray[point[0]._index]);

        document.getElementById('topicDetails').innerHTML = `<h1>${labelArray[point[0]._index]}</h1><div>${titleArray[point[0]._index]}</div>`;

    }

    let toggle = function (checkbox) {
        if (!checkbox.checked)
            chart.data.datasets.forEach(function (element, index) {
                if (element.label === checkbox.value) {
                    config.data.datasets[index].hidden = true;
                    document.getElementById('canvasContainer').innerHTML = `<canvas id="chartCanvas" onclick="displayData(event)"></canvas>`;
                    chartCanvas = document.getElementById('chartCanvas').getContext('2d');
                    chart = new Chart(chartCanvas, config);
                }
            });
        else
            chart.data.datasets.forEach(function (element, index) {
                if (element.label === checkbox.value) {
                    config.data.datasets[index].hidden = false;
                    document.getElementById('canvasContainer').innerHTML = `<canvas id="chartCanvas" onclick="displayData(event)"></canvas>`;
                    chartCanvas = document.getElementById('chartCanvas').getContext('2d');
                    chart = new Chart(chartCanvas, config);
                }
            });
    };

    window.createChart = createChart;
    window.toggle = toggle;
    window.displayData = displayData;
    window.createMiniChart = createMiniChart;

    function createMiniChart(){

        let item = document.getElementById('labelList').value;
        let query = document.getElementById('options').value;
        labelArray = [query];

        if(query === 'All')
        {
            createChart();
            return;
        }

        $.getJSON("jsondata.json", function (data) {
                let intensity = [];
                let relevance = [];
                let likelihood = [];
                titleArray = [];

            data.forEach(function(element){
                if(element[item] == query)
                {
                    if (element.intensity != '')
                        intensity.push(element.intensity);
                    if (element.relevance != '')
                        relevance.push(element.relevance);
                    if (element.likelihood != '')
                        likelihood.push(element.likelihood);
                    if(element.title != '')
                        titleArray.push(element.title);

                }


            });

            intensity = intensity.reduce((a, b) => a + b, 0) / intensity.length;
            relevance = relevance.reduce((a, b) => a + b, 0) / relevance.length;
            likelihood = likelihood.reduce((a, b) => a + b, 0) / likelihood.length;

            config.data.datasets[0].data = [intensity];
            config.data.datasets[1].data = [relevance];
            config.data.datasets[2].data = [likelihood];
            config.data.labels = labelArray;

            document.getElementById('chartCanvas').parentNode.removeChild(document.getElementById('chartCanvas'));
            document.getElementById('canvasContainer').innerHTML = `<canvas id="chartCanvas" onclick="displayData(event)"></canvas>`;
            chartCanvas = document.getElementById('chartCanvas').getContext('2d');
            chart = new Chart(chartCanvas, config);

        });


    }
};

