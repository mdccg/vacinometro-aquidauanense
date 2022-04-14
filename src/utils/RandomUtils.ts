const getRandomNumber = (min = 0, max = 255) => min + Math.floor(Math.random() * (max + 1));

export const getRandomRgbColor = () => 
  `rgb(${getRandomNumber()}, ${getRandomNumber()}, ${getRandomNumber()})`;