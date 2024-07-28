let chart; // グローバル変数としてチャートを宣言
let originalData; // 元のデータを保存する変数
let customColors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FFA500']; // 初期色設定

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const chartConfigKey = urlParams.get('chartConfigKey');
    const controls = document.getElementById('controls');
    if (chartConfigKey) {
        const storedConfig = localStorage.getItem(chartConfigKey);
        if (storedConfig) {
            try {
                const chartConfig = JSON.parse(storedConfig);
                chartConfig.chart.options3d.enabled = true; // Enable 3D
                chartConfig.chart.options3d.alpha = 10;
                chartConfig.chart.options3d.beta = 30;
                chartConfig.chart.options3d.depth = 350;
                chartConfig.chart.options3d.viewDistance = 25;
                chartConfig.chart.options3d.fitToPlot = false;
                chartConfig.chart.options3d.frame = {
                    bottom: { size: 1, color: 'rgba(0,0,0,0.02)' },
                    back: { size: 1, color: 'rgba(0,0,0,0.04)' },
                    side: { size: 1, color: 'rgba(0,0,0,0.06)' }
                };

                chart = Highcharts.chart('container', chartConfig);
                controls.classList.add('hidden'); // Hide controls

                // Enable 3D navigation for the chart
                enable3DNavigation(chart);
            } catch (e) {
                console.error('Error parsing stored chart configuration:', e);
            }
        } else {
            console.error('No stored chart configuration found for key:', chartConfigKey);
        }
    }
    
    const analyzeButton = document.getElementById('analyzeButton');
    const resizeChartButton = document.getElementById('resizeChart');
    const resizeChartByRatioButton = document.getElementById('resizeChartByRatio');
    const updateAxisRangeButton = document.getElementById('updateAxisRange');
    const updateUnitsButton = document.getElementById('updateUnits');
    const updateViewDistanceButton = document.getElementById('updateViewDistance');
    const updateColoringButton = document.getElementById('updateColoring');
    const updateColorsButton = document.getElementById('updateColors');
    const generateLinkButton = document.getElementById('generateLink');

    analyzeButton.addEventListener('click', processFile);
    resizeChartButton.addEventListener('click', resizeChart);
    resizeChartByRatioButton.addEventListener('click', resizeChartByRatio);
    updateAxisRangeButton.addEventListener('click', updateAxisRange);
    updateUnitsButton.addEventListener('click', updateAxisUnits);
    updateViewDistanceButton.addEventListener('click', updateViewDistance);
    updateColoringButton.addEventListener('click', updateColoring);
    updateColorsButton.addEventListener('click', updateColors);
    generateLinkButton.addEventListener('click', generateLink);
});

function processFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) {
        alert("Please select a file.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // 読み込まれたデータをコンソールに出力
        console.log("Loaded data:", json);

        // ファイル名から拡張子を除いた名前を取得 (追加)
        const fileName = file.name.split('.').slice(0, -1).join('.');

        // X, Y, Z軸の名称を初期設定 (追加)
        if (json.length > 0) {
            document.getElementById('xAxisUnit').value = json[0][0] || 'X-Axis';
            document.getElementById('yAxisUnit').value = json[0][1] || 'Y-Axis';
            document.getElementById('zAxisUnit').value = json[0][2] || 'Z-Axis';
        }

        // チャートタイトルをファイル名に設定 (追加)
        document.getElementById('container').setAttribute('data-title', fileName);
        
        originalData = json;
        processData(json);
    };

    reader.onerror = function(e) {
        console.error("ファイルの読み込み中にエラーが発生しました:", e);
    };

    reader.readAsBinaryString(file);
}

function resizeChart() {
    console.log("Resizing chart...");
    const width = parseInt(document.getElementById('chartWidth').value, 10);
    const height = parseInt(document.getElementById('chartHeight').value, 10);
    const depth = parseInt(document.getElementById('chartDepth').value, 10); // z軸のサイズを取得

    if (chart) {
        chart.update({
            chart: {
                width: width,
                height: height,
                options3d: {
                    depth: depth // z軸のサイズを更新
                }
            }
        });
        console.log("Chart resized to width:", width, "height:", height, "depth:", depth);
    } else {
        console.error("Chart not found.");
    }
}

function resizeChartByRatio() {
    console.log("Resizing chart by ratio...");
    const baseSize = parseInt(document.getElementById('baseSize').value, 10);
    const widthRatio = parseFloat(document.getElementById('widthRatio').value);
    const heightRatio = parseFloat(document.getElementById('heightRatio').value);
    const depthRatio = parseFloat(document.getElementById('depthRatio').value);

    const width = Math.round(baseSize * widthRatio);
    const height = Math.round(baseSize * heightRatio);
    const depth = Math.round(baseSize * depthRatio);

    if (chart) {
        chart.update({
            chart: {
                width: width,
                height: height,
                options3d: {
                    depth: depth // z軸のサイズを更新
                }
            }
        });
        console.log("Chart resized by ratio to width:", width, "height:", height, "depth:", depth);
    } else {
        console.error("Chart not found.");
    }
}

function updateAxisUnits() {
    console.log("Updating axis units...");
    if (chart) {
        chart.xAxis[0].setTitle({ text: document.getElementById('xAxisUnit').value });
        chart.yAxis[0].setTitle({ text: document.getElementById('yAxisUnit').value });
        chart.zAxis[0].setTitle({ text: document.getElementById('zAxisUnit').value });
        console.log("Axis units updated.");
    } else {
        console.error("Chart not found.");
    }
}

function updateAxisRange() {
    console.log("Updating axis range...");
    if (chart) {
        chart.xAxis[0].update({
            min: parseFloat(document.getElementById('xMin').value),
            max: parseFloat(document.getElementById('xMax').value)
        });
        chart.yAxis[0].update({
            min: parseFloat(document.getElementById('yMin').value),
            max: parseFloat(document.getElementById('yMax').value)
        });
        chart.zAxis[0].update({
            min: parseFloat(document.getElementById('zMin').value),
            max: parseFloat(document.getElementById('zMax').value)
        });
        console.log("Axis range updated.");
    } else {
        console.error("Chart not found.");
    }
}

function updateViewDistance() {
    console.log("Updating view distance...");
    const viewDistance = parseInt(document.getElementById('viewDistance').value, 10);

    if (chart) {
        chart.update({
            chart: {
                options3d: {
                    viewDistance: viewDistance
                }
            }
        });
        console.log("View distance updated to:", viewDistance);
    } else {
        console.error("Chart not found.");
    }
}

function updateColoring() {
    console.log("Updating coloring...");
    const colorColumn = document.getElementById('colorColumn').value;
    processData(originalData, colorColumn);
}

function updateColors() {
    console.log("Updating custom colors...");
    for (let i = 0; i < 5; i++) {
        customColors[i] = document.getElementById(`color${i}`).value;
    }
    processData(originalData, document.getElementById('colorColumn').value);
}

function processData(data, colorColumn = 'z') {
    const dataArray = [];
    let xMin = Infinity, xMax = -Infinity;
    let yMin = Infinity, yMax = -Infinity;
    let zMin = Infinity, zMax = -Infinity
