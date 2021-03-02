import { createGlobalStyle } from "styled-components";
export const GlobalStyles = createGlobalStyle`
  html, body {
    background-color: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: all 0.50s linear;
  }
  nav{
    background-color: ${({ theme }) => theme.body} !important;
    border-color:  ${({ theme }) => theme.borderColor} !important;
  }
  .menu-font, .lip-text, table, .lip-subtext, h2, .MuiTypography-subtitle1, .MuiTypography-h3, .MuiTypography-h6{
    color: ${({ theme }) => theme.text} !important;
  }
  .lip-header{
    background: ${({ theme }) => theme.header};
  }
  .dashboard-container, .downshift-input, .multiselect-menu, .downshift-menu{
    background-color: ${({ theme }) => theme.body} !important; 
  }
  .service-component, .modal-content, .form-control, .lip-button, .form-control:focus, .ant-input, .card-body, .page-link, .lipbg, .bg-white{
    background: ${({ theme }) => theme.cards} !important;
    color: ${({ theme }) => theme.text} !important;
    border-color: ${({ theme }) => theme.text} !important;
  }
  .leading-7{
    color: ${({ theme }) => theme.semibold} !important;
  }
  .heading-color, .lip-title, .des-heading{
    color: ${({ theme }) => theme.semibold} !important;
  }
  .border-2, .navbar-divider{
    border-color:  ${({ theme }) => theme.borderColor};
  }
  .credit-bar{
    background: ${({ theme }) => theme.cards};
  }
  .Mui-selected{
    background-color: ${({ theme }) => theme.semibold} !important;
    color: ${({ theme }) => theme.body} !important;
  }
  `;
export const GlobalFonts = createGlobalStyle`
  h1, h2, h3,.lip-title, .des-heading{
    font-size: ${({ theme }) => theme.heading} !important;
  }
  `;
