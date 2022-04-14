import SentDosesMonthlyAnalysis from './../types/SentDosesMonthlyAnalysis';
import { parseStringToNumber } from '../../utils/NumberUtils';

import moment from 'moment';

export const getSentDosesMonthlyAnalyzes = (
  sentDoses: string[],
  dates: string[]
): SentDosesMonthlyAnalysis[] => {
  const sentDosesMonthlyAnalyzesMap = new Map<string, number[]>();

  sentDoses.forEach(sentDose => {
    const [
      deliveryDate,
      , // Always Aquidauana
      vaccineBrand,
      SentDosesTotal,
      SentFirstDosesTotal,
      SentSecondDosesTotal,
      SentSingleDosesTotal,
      SentBoosterDosesTotal
    ] = sentDose;

    let sentDosesMonthlyAnalysis = sentDosesMonthlyAnalyzesMap.get(vaccineBrand)
      || Array(dates.length).fill(0);
    
    const monthYear = moment(deliveryDate, 'DD/MM/YYYY').format('MMM[.] YYYY');
    const index = dates.indexOf(monthYear);

    sentDosesMonthlyAnalysis[index] += parseStringToNumber(SentDosesTotal);
    sentDosesMonthlyAnalyzesMap.set(vaccineBrand, sentDosesMonthlyAnalysis);
  });

  const sentDosesMonthlyAnalyzes = [];

  for (const [vaccineBrand, sentDosesTotalByMonth] of sentDosesMonthlyAnalyzesMap) {
    const sentDosesMonthlyAnalysis = <SentDosesMonthlyAnalysis>({
      vaccineBrand, sentDosesTotalByMonth
    });
    sentDosesMonthlyAnalyzes.push(sentDosesMonthlyAnalysis);
  }

  return sentDosesMonthlyAnalyzes;
}