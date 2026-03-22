/**
 * Guest Pages
 */
export { default as LandingPage } from './home';
export { LoginPage } from './Auth/Auth';

/**
 * Admin Pages
 */
// Dashboard (Admin)
export { default as Dashboard } from './Dashboard/dashboard';

// User Pages (Admin)
export { default as UserPage } from './Dashboard/UserPage';
export { default as UserInput } from './Dashboard/UserInput';
export { default as UserEdit } from './Dashboard/UserEdit';

// Product Pages (Admin)
export { default as ProductPage } from './Dashboard/ProductPage';
export { default as ProductCreate } from './Dashboard/ProductCreate';