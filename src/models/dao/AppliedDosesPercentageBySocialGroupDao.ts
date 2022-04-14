import AppliedDosesPercentageBySocialGroup from './../types/AppliedDosesPercentageBySocialGroup';
import { parseStringToNumber } from '../../utils/NumberUtils';

export const getAppliedDosesPercentageBySocialGroup = (appliedDoses: string[]) => {
  const appliedDosesPercentagesBySocialGroupMap = new Map<string, number>();

  appliedDoses.forEach(appliedDose => {
    const [
      date,
      , // Always Aquidauana
      vaccineBrand,
      socialGroup,
      appliedDosesTotal,
      appliedFirstDosesTotal,
      appliedSecondDosesTotal,
      appliedSingleDosesTotal,
      appliedBoosterDosesTotal
    ] = appliedDose;

    let currentValue = appliedDosesPercentagesBySocialGroupMap.get(socialGroup) || 0;
    currentValue += parseStringToNumber(appliedDosesTotal);
    appliedDosesPercentagesBySocialGroupMap.set(socialGroup, currentValue);
  });

  const appliedDosesPercentagesBySocialGroup = [];

  for (const [socialGroup, appliedDosesTotal] of appliedDosesPercentagesBySocialGroupMap) {
    const appliedDosesPercentageBySocialGroup = <AppliedDosesPercentageBySocialGroup>({
      socialGroup, appliedDosesTotal
    });
    appliedDosesPercentagesBySocialGroup.push(appliedDosesPercentageBySocialGroup);
  }

  return appliedDosesPercentagesBySocialGroup;
}