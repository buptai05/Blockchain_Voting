var barChart = document.getElementById('barChart');
var barChart = new Chart(barChart, {
    type: 'bar',
    data: {
        labels: ['Pele', 'Maradona', 'Messi'],
        datasets: [{
            label: '# of Votes',
            data: [5, 4, 2, 1],
            backgroundColor: [
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(153, 102, 255, 0.2)',
            ],
            borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(153, 102, 255, 1)',
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
var xValues = ["Pele", "Maradona", "Messi"];
var yValues = [5, 4, 2];
var barColors = [
    "#00aba9",
    "#b91d47",
    "#2b5797",
];

new Chart("pieChart", {
    type: "pie",
    data: {
        labels: xValues,
        datasets: [{
            backgroundColor: barColors,
            data: yValues
        }]
    },
    options: {
        title: {
            display: true,
            text: "Vote Count"
        }
    }
});