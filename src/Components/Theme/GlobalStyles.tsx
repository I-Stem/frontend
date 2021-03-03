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
    transition: all 0.50s linear;
  }
  .menu-font,.reset-all, .lip-text, table, .heading-color .lip-subtext, h2, h3, .MuiTypography-subtitle1, .MuiTypography-h3, .MuiTypography-h6{
    color: ${({ theme }) => theme.text} !important;
    transition: all 0.50s linear;
  }
  .lip-header{
    background: ${({ theme }) => theme.header};
    transition: all 0.50s linear;
  }
  .dashboard-container, .theme-card, .downshift-input, .multiselect-menu, .downshift-menu{
    background-color: ${({ theme }) => theme.body} !important;
    transition: all 0.50s linear; 
  }
  .ant-table-content, .ant-table-thead, .service-component, .modal-content, .form-control, .lip-button, .form-control:focus, .ant-input, .card-body, .page-link, .lipbg, .bg-white{
    background: ${({ theme }) => theme.cards} !important;
    color: ${({ theme }) => theme.text} !important;
    border-color: ${({ theme }) => theme.text} !important;
    transition: all 0.50s linear;
  }
  .theme-button,
  .theme-button:focus,
  .theme-button:hover,
  .theme-button:active{
    background: ${({ theme }) => theme.header} !important;
    color: ${({ theme }) => theme.semibold} !important;
    border-color: ${({ theme }) => theme.text} !important;
    transition: all 0.50s linear;
  }
  .leading-7 {
    color: ${({ theme }) => theme.text} !important;
    transition: all 0.50s linear;
  }
  .lip-title, .des-heading, .navbar__Logout {
    color: ${({ theme }) => theme.semibold} !important;
    transition: all 0.50s linear;
  }
  .border-2, .navbar-divider, .theme-overlay{
    border-color:  ${({ theme }) => theme.borderColor};
  }
  .credit-bar{
    background: ${({ theme }) => theme.cards};
    transition: all 0.50s linear;
  }
  .Mui-selected{
    background-color: ${({ theme }) => theme.semibold} !important;
    color: ${({ theme }) => theme.body} !important;
    transition: all 0.50s linear;
  }
  `;
export const GlobalFonts = createGlobalStyle`
.activity-text,text-sm,.font-14,.detail-button,.reset-button,.manage-options,.notes-by,.text-sm,p, li{
  font-size: ${({ theme }) => theme.font0} !important;
  transition: all 0.50s linear;
}
legend,.text-base,.lip-subtext,.lip-button,.lip-radio,.afc-fieldset,.lip-text,.lip-earned,.modal-title,.stud-select,.stud-upload,.font-16,.MuiInputLabel-root,.register-buttons,.login-button,.auth-input,.lip-label-r,.lip-nav-button,.text-lg,.des-heading,.navbar__Logout,.tag-bg,.downshift-input::placeholder,.student-detail-text,.tab-text{
  font-size: ${({ theme }) => theme.font1} !important;
  transition: all 0.50s linear;
 }
 .text-xl,.MuiTypography-h6,.MuiTypography-subtitle1,.MuiTypography-h6,.label.button-upload{
  font-size: ${({ theme }) => theme.font3} !important;
  transition: all 0.50s linear;
 }
 .lip-title,.message-login,.MuiTypography-h3{
  font-size: ${({ theme }) => theme.font3} !important;
  transition: all 0.50s linear;
 }

  `;
