import SentDosesMonthlyAnalysis from './../models/types/SentDosesMonthlyAnalysis';
import AppliedDosesPercentageBySocialGroup from './../models/types/AppliedDosesPercentageBySocialGroup';
import * as ChartJsUtils from './ChartJsUtils';
import { getRandomRgbColor } from './RandomUtils';

import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { ChartConfiguration } from 'chart.js';

import { join } from 'path';
import { writeFileSync } from 'fs';

/**
 * @param {any[]} array [{"nome":"Matheus","idade":20},{"nome":"Kokushibo","idade":480}]
 * @param {string} key "idade"
 * @returns {any[]} [20, 480]
 */
const polarize = (array: any[], key: string) =>
  array.map(object => object[key]);

const getMultiAxisLineChartData = (
  sentDosesMonthlyAnalyzes: SentDosesMonthlyAnalysis[],
  dates: string[]
  ) => {
  const labels = dates;

  const datasets = sentDosesMonthlyAnalyzes.map((sentDosesMonthlyAnalysis, index) => {
    const randomColor = getRandomRgbColor();

    let yAxisID;

    if (index === 0) {
      yAxisID = 'y';
    }

    return ({
      label: sentDosesMonthlyAnalysis.vaccineBrand,
      data: sentDosesMonthlyAnalysis.sentDosesTotalByMonth,
      borderColor: randomColor,
      backgroundColor: ChartJsUtils.transparentize(randomColor, 0.5),
      yAxisID
    });
  });

  return ({ labels, datasets });
}

const getPieChartData = (
  appliedDosesPercentageBySocialGroup: AppliedDosesPercentageBySocialGroup[]
  ) => {
  const socialGroups = polarize(appliedDosesPercentageBySocialGroup, 'socialGroup');
  const appliedDosesPercentages = polarize(appliedDosesPercentageBySocialGroup, 'appliedDosesTotal');
  const backgroundColours = Array(socialGroups.length).fill(null).map(() => getRandomRgbColor());

  const datasets = [
    {
      label: 'Dataset 1',
      data: appliedDosesPercentages,
      backgroundColor: backgroundColours
    }
  ];

  return ({ labels: socialGroups, datasets });
}

export const generateMultiAxisLineChart = (
  multiAxisLineChartName: string,
  sentDosesMonthlyAnalyzes: SentDosesMonthlyAnalysis[],
  dates: string[]
  ) => {
  if(!sentDosesMonthlyAnalyzes) return;
  
  const multiAxisLineChartData = getMultiAxisLineChartData(sentDosesMonthlyAnalyzes, dates);
  
  const chartJSNodeCanvas = new ChartJSNodeCanvas({
    width: 1366,
    height: 768,
    backgroundColour: 'white'
  });

  const chartConfiguration: ChartConfiguration = {
    type: 'line',
    data: multiAxisLineChartData,
    options: {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        title: {
          display: true,
          text: multiAxisLineChartName
        }
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left'
        }
      }
    }
  };

  const multiAxisLineChart = chartJSNodeCanvas.renderToBufferSync(chartConfiguration);
  const fileName = 'sent-doses-total-by-vaccine-brand.png';
  const path = join(__dirname, '..', 'charts', fileName);
  writeFileSync(path, multiAxisLineChart);
  console.log('⚡ Eu juro solenemente não fazer nada de bom.');
}

export const generatePieChart = (
  pieChartName: string,
  appliedDosesPercentageBySocialGroup: AppliedDosesPercentageBySocialGroup[]
) => {
  if(!appliedDosesPercentageBySocialGroup) return;

  const pieChartData = getPieChartData(appliedDosesPercentageBySocialGroup);

  const chartJSNodeCanvas = new ChartJSNodeCanvas({
    width: 1366,
    height: 768,
    backgroundColour: 'white'
  });

  const chartConfiguration: ChartConfiguration = {
    type: 'pie',
    data: pieChartData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        },
        title: {
          display: true,
          text: pieChartName
        }
      }
    }
  };

  const pieChart = chartJSNodeCanvas.renderToBufferSync(chartConfiguration);
  const fileName = 'applied-doses-percentages-by-social-groups.png';
  const path = join(__dirname, '..', 'charts', fileName);
  writeFileSync(path, pieChart);
  console.log('⚡ Malfeito feito.');
}