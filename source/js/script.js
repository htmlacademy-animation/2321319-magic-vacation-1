// modules
import Page from './modules/page.js';
import mobileHeight from './modules/mobile-height-adjust.js';
import menu from './modules/menu.js';
import footer from './modules/footer.js';
import result from './modules/result.js';
import form from './modules/form.js';
import social from './modules/social.js';

// init modules
// eslint-disable-next-line no-new
new Page();
mobileHeight();
menu();
footer();
result();
form();
social();
