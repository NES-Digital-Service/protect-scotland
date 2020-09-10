import colors from './colors';

export default (scale: (v: number) => number) => {
  const text = {
    h1Heading: {
      fontFamily: 'lato-bold',
      fontSize: scale(28),
      lineHeight: scale(36)
    },
    h2Heading: {
      fontFamily: 'lato-bold',
      fontSize: scale(26),
      lineHeight: scale(32)
    },
    h3Heading: {
      fontFamily: 'lato-bold',
      fontSize: scale(24),
      lineHeight: scale(32)
    },
    h4Heading: {
      fontFamily: 'lato-bold',
      fontSize: scale(18),
      lineHeight: scale(23)
    },
    leader: {
      fontFamily: 'lato',
      fontSize: scale(21),
      lineHeight: scale(28)
    },
    paragraph: {
      fontFamily: 'roboto',
      fontSize: scale(18),
      lineHeight: scale(28)
    },
    smallerParagraph: {
      fontFamily: 'roboto',
      fontSize: scale(16),
      lineHeight: scale(21)
    },
    fontFamily: {
      roboto: 'roboto',
      robotoBold: 'roboto-bold',
      lato: 'lato',
      latoBold: 'lato-bold'
    }
  };

  const defaultText = {
    ...text.paragraph,
    color: colors.darkGrey
  };

  const defaultBold = {
    ...defaultText,
    fontFamily: text.fontFamily.robotoBold
  };

  return {
    default: defaultText,
    defaultBold,
    ...text
  };
};
