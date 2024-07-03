let chart; // グローバル変数としてチャートを宣言

document.addEventListener('DOMContentLoaded', function() {
    const analyzeButton = document.getElementById('analyzeButton');
    const resizeChartButton = document.getElementById('resizeChart');
    const updateAxisRangeButton = document.getElementById('updateAxisRange');
    const updateUnitsButton = document.getElementById('updateUnits');
    const updateViewDistanceButton = document.getElementById('updateViewDistance');

    analyzeButton.addEventListener('click', processFile);
    resizeChartButton.addEventListener('click', resizeChart);
    updateAxisRangeButton.addEventListener('click', updateAxisRange);
    updateUnitsButton.addEventListener('click', updateAxisUnits);
    updateViewDistanceButton.addEventListener('click', updateViewDistance);
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

function processData(data) {
    const dataArray = [];
    for (let i = 1; i < data.length; i++) { // ヘッダー行をスキップ
        const row = data[i];
        if (Array.isArray(row) && row.length >= 4) { // 少なくとも4列があることを確認
            const x = parseFloat(row[0]);
            const y = parseFloat(row[1]);
            const z = parseFloat(row[2]);
            const name = row[3];
            const color = 'rgba(0, 105, 255, ' + (z / 5) + ')'; // zの範囲に応じた色の設定（大きい方が濃い）

            dataArray.push({
                'x': x,
                'y': y,
                'z': z,
                'name': name,
                'color': color
            });
        }
    }

    console.log(dataArray);  // デバッグ用にデータを確認
    createChart(dataArray);
}

function createChart(dataArray) {
    console.log("Creating chart with data:", dataArray); // デバッグ用ログ
    const chartTitle = document.getElementById('container').getAttribute('data-title'); // 追加
    const xAxisUnit = document.getElementById('xAxisUnit').value; // 追加
    const yAxisUnit = document.getElementById('yAxisUnit').value; // 追加
    const zAxisUnit = document.getElementById('zAxisUnit').value; // 追加
    const viewDistance = parseInt(document.getElementById('viewDistance').value, 10); // 追加
    chart = Highcharts.chart('container', {
        chart: {
            renderTo: 'container',
            type: 'scatter3d',
            margin: [80, 80, 80, 80], // マージンを調整
            width: 650, // 初期幅
            height: 600, // 初期高さ
            options3d: {
                enabled: true,
                alpha: 10,
                beta: 30,
                depth: 350,
                viewDistance: viewDistance,
                fitToPlot: false, // fitToPlotをfalseに設定
                frame: {
                    bottom: { size: 1, color: 'rgba(0,0,0,0.02)' },
                    back: { size: 1, color: 'rgba(0,0,0,0.04)' },
                    side: { size: 1, color: 'rgba(0,0,0,0.06)' }
                }
            }
        },
        title: {
            text: chartTitle || '3D Scatter Plot' // ファイル名をタイトルに設定
        },
        subtitle: {
            text: 'Use the mouse to navigate around this 3D plot.'
        },
        plotOptions: {
            scatter: {
                width: 10,
                height: 10,
                depth: 10
            }
        },
        xAxis: {
            min: parseFloat(document.getElementById('xMin').value),
            max: parseFloat(document.getElementById('xMax').value),
            gridLineWidth: 1,
            title: {
                text: xAxisUnit
            }
        },
        yAxis: {
            min: parseFloat(document.getElementById('yMin').value),
            max: parseFloat(document.getElementById('yMax').value),
            title: {
                text: yAxisUnit
            }
        },
        zAxis: {
            min: parseFloat(document.getElementById('zMin').value),
            max: parseFloat(document.getElementById('zMax').value),
            showFirstLabel: false,
            title: {
                text: zAxisUnit
            }
        },
        legend: {
            enabled: false
        },
        series: [{
            name: 'Data',
            colorByPoint: true,
            data: dataArray,
            keys: ['x', 'y', 'z', 'name', 'color'] // データのキーを指定
        }],
        tooltip: {
            headerFormat: '',
            pointFormat: `<b>{point.name}</b><br>${xAxisUnit}: {point.x:.3f}<br>${yAxisUnit}: {point.y:.3f}<br>${zAxisUnit}: {point.z:.3f}` // 小数点以下3桁まで表示
          }
    });
    console.log(chart); // チャートオブジェクトの確認

    // 3D散布図のマウスイベントを追加
    (function (H) {
        function dragStart(eStart) {
            eStart = chart.pointer.normalize(eStart);

            const posX = eStart.chartX;
            const posY = eStart.chartY;
            const alpha = chart.options.chart.options3d.alpha;
            const beta = chart.options.chart.options3d.beta;
            const sensitivity = 5;  // lower is more sensitive
            const handlers = [];

            function drag(e) {
                // Get e.chartX and e.chartY
                e = chart.pointer.normalize(e);

                chart.update({
                    chart: {
                        options3d: {
                            alpha: alpha + (e.chartY - posY) / sensitivity,
                            beta: beta + (posX - e.chartX) / sensitivity
                        }
                    }
                }, undefined, undefined, false);
            }

            function unbindAll() {
                handlers.forEach(function (unbind) {
                    if (unbind) {
                        unbind();
                    }
                });
                handlers.length = 0;
            }

            handlers.push(H.addEvent(document, 'mousemove', drag));
            handlers.push(H.addEvent(document, 'touchmove', drag));
            handlers.push(H.addEvent(document, 'mouseup', unbindAll));
            handlers.push(H.addEvent(document, 'touchend', unbindAll));
        }
        H.addEvent(chart.container, 'mousedown', dragStart);
        H.addEvent(chart.container, 'touchstart', dragStart);
    }(Highcharts));
}
