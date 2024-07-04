export default ({palette, spacing}) => {
  const radius = spacing(2.5);
  const size = spacing(4);
  const rightBgColor = palette.primary.light;
  // if you want the same as facebook messenger, use this color '#09f'
  return {
    avatar: {
      width: size,
      height: size,
      marginLeft: '1rem',
    },
    leftRow: {
      textAlign: 'left',
    },
    rightRow: {
      textAlign: 'right',
    },
    msg: {
      padding: spacing(1, 2),
      borderRadius: 4,
      marginBottom: 4,
      display: 'inline-block',
      wordBreak: 'break-word',
      fontFamily:
          // eslint-disable-next-line max-len
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      fontSize: '14px',
    },
    left: {
      borderTopRightRadius: radius,
      borderBottomRightRadius: radius,
      backgroundColor: palette.grey[100],
      maxWidth: '62rem',
    },
    leftTimeText: {
      textAlign: 'right',
      color: '#757575',
      fontSize: '12px',
    },
    rightTimeText: {
      textAlign: 'right',
      color: '#fafafa',
      fontSize: '11px',
    },
    right: {
      borderTopLeftRadius: radius,
      borderBottomLeftRadius: radius,
      backgroundColor: rightBgColor,
      color: palette.common.white,
      right: '0.5rem',
      maxWidth: '42rem',
    },
    leftFirst: {
      borderTopLeftRadius: radius,
    },
    leftLast: {
      borderBottomLeftRadius: radius,
    },
    rightFirst: {
      borderTopRightRadius: radius,
    },
    rightLast: {
      borderBottomRightRadius: radius,
    },
    block: {
      paddingBottom: '2rem',
    },
  };
};
