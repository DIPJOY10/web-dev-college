import styled, { css, keyframes } from 'styled-components';

const FadeInAnimation = keyframes`
  from {opacity: 0;}
  to {opacity: 1;}
`;

export const PageContainer = styled.div`
  ${({ theme }) => css`
    &.page-container {
      position: relative;
      display: flex;
      flex-direction: column-reverse;
      width: 100%;
      height: 100%;
      @media (min-width: ${theme.breakpoints.sm}) {
        flex-direction: row;
      }
    }
  `}
`;

export const RightWrapper = styled.div`
  ${({ theme }) => css`
    position: relative;
    height: 100%;
    overflow: hidden;
    flex-grow: 1;
    transition: all 0.3s ease-in;
    background: #f5f5f5;


    ${'' /* initial style */}
    ${'' /* @media (min-width: ${theme.breakpoints.values.sm}px) {
      margin-left: ${theme.drawer.smWidth};
    }
    @media (min-width: ${theme.breakpoints.values.md}px) {
      margin-left: ${theme.drawer.width};
    } */}

    ${'' /* after fixing the bug */}
    @media (min-width: ${theme.breakpoints.values.xs}px) {
      margin-left: 0px;
      width: calc(100vw - 0px);
    }
    @media (max-width: ${theme.breakpoints.values.xs}px) {
      margin-left: ${theme.drawer.smWidth};
      width: calc(100vw - ${theme.drawer.smWidth});
      position: absolute;
    }
    @media (min-width: ${theme.breakpoints.values.sm}px) {
      margin-left: ${theme.drawer.smWidth};
      width: calc(100vw - ${theme.drawer.smWidth});
      position: absolute;
    }
    @media (min-width: ${theme.breakpoints.values.md}px) {
      margin-left: ${theme.drawer.width};
      width: calc(100vw - ${theme.drawer.width});
    }
  `}
`;

export const ContentWrapper = styled.main`
  ${({ theme: { appbar }, noAppbar }) => css`
    max-height: calc(100% - ${noAppbar ? '0px' : appbar.height});
    /* margin-top: ${appbar.height}; */
    overflow: auto;
    ${'' /* padding: 16px; */}
    background: #f5f5f5;
    .page-content > *:only-child {
      opacity: 0;
      animation-name: ${FadeInAnimation};
      animation-duration: 1.25s;
      animation-fill-mode: forwards;
    }
  `}
`;
