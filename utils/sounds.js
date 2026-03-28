const sounds = {
  correct: new Audio("/sounds/correct.mp3"),
  wrong: new Audio("/sounds/wrong.mp3"),
  win: new Audio("/sounds/win.mp3"),
};

export const playSound = (type) => {
  const sound = sounds[type];
  if (sound) {
    sound.currentTime = 0;
    sound.play();
  }
};