enum Alignment {
  topToTop = 'topToTop',
  topToBottom = 'topToBottom',
  rightToRight = 'rightToRight',
  rightToLeft = 'rightToLeft',
  bottomToTop = 'bottomToTop',
  bottomToBottom = 'bottomToBottom',
  leftToRight = 'leftToRight',
  leftToLeft = 'leftToLeft',
  xCenterToXCenter = 'xCenterToXCenter',
  yCenterToYCenter = 'yCenterToYCenter',
}

export const AlignmentXs: Alignment[] = [
  Alignment.rightToRight,
  Alignment.rightToLeft,
  Alignment.leftToRight,
  Alignment.leftToLeft,
  Alignment.xCenterToXCenter,
];

export const AlignmentYs: Alignment[] = [
  Alignment.topToTop,
  Alignment.topToBottom,
  Alignment.bottomToTop,
  Alignment.bottomToBottom,
  Alignment.yCenterToYCenter,
];

export default Alignment;
