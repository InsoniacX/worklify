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
export { default as UserPage } from './Dashboard/Users/UserPage';
export { default as UserInput } from './Dashboard/Users/UserInput';
export { default as UserEdit } from './Dashboard/Users/UserEdit';

// Product Pages (Admin)
export { default as ProductPage } from './Dashboard/Product/ProductPage';
export { default as ProductCreate } from './Dashboard/Product/ProductCreate';
export { default as ProductEdit } from './Dashboard/Product/ProductEdit';

// Profile Pages (Admin)
export { default as ProfilePage } from './Dashboard/Profile';