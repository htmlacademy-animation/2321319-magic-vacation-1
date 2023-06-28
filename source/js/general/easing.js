export function easeInOutQuad(x) {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

export function easeInQuad(x) {
  return x * x;
}

export function easeOutQuad(x) {
  return 1 - (1 - x) * (1 - x);
}

export function easeOutElastic(x) {
  const c4 = (2 * Math.PI) / 3;

  if (x === 0) {
    return 0;
  } else if (x === 1) {
    return 1;
  } else {
    return Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
  }
}

export function easeOutExpo(x) {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

export function easeInExpo(x) {
  return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
}

