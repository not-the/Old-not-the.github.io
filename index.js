// HTML
const body              = $('body');
const nav               = dom('nav');
const menu_button       = dom('menu_button');
const hamburger_menu    = dom('hamburger_menu');
const theme_button      = dom('theme_button');
const theme_button_icon = dom('theme_button_icon');
const video_main        = dom('video_main');
const reduce_motion     = dom('reduce_motion');
const backdrop          = dom('backdrop');

// Variables
const mobile_layout_width = 600;
var hamburger_open = false;
var theme = false; // true = light
var reducedMotion = false;
var ti1; // Timeout 1
var ti2; // Timeout 2

// Functions
/** Hamburger menu toggle */
function toggleMenu() {
    if(!hamburger_open && window.innerWidth > mobile_layout_width) return;
    hamburger_open = !hamburger_open;
    style(nav, 'menu_open', hamburger_open);    // Open navbar
    style(backdrop, 'visible', hamburger_open); // Show backdrop
}
/** Toggle between dark/light mode */
function switchTheme(animate=true) {
    theme = !theme;
    store('theme', `${theme}`); // Save in localStorage
    style(body, 'theme_light', theme); // Set theme

    // Animate
    if(!animate) { themeIcon(); return; };
    theme_button_icon.classList.remove('a_rollout')
    theme_button_icon.classList.add('a_rollout');
    clearTimeout(ti1);
    clearTimeout(ti2);
    ti1 = setTimeout(themeIcon, 250);
    ti2 = setTimeout(() => { theme_button_icon.classList.remove('a_rollout'); }, 500);
    function themeIcon() {
        theme ? // Update theme button
          theme_button_icon.src = '/assets/icon/sun.svg'
        : theme_button_icon.src = '/assets/icon/moon.svg';
    }
}
/** Scrolls page to top */
function toTop(closemenu=false) {
    window.scrollTo(0, 0);
    document.activeElement.blur(); // Move keyboard navigation back to start
    if(!closemenu) return;
    toggleMenu();
}

/** Toggles "Reduce Motion" */
function toggleMotion() {
    reducedMotion = !reducedMotion;
    store('reducedMotion', `${reducedMotion}`); // Save in localStorage
    style(body, 'reduced_motion', reducedMotion); // Set theme
    reduce_motion.innerText = reducedMotion ? '⏵︎ Reduce motion' : '⏸︎ Reduce motion';

    // Disable AOS
    let alternate = true;
    document.querySelectorAll('[data-aos]').forEach(element => {
        element.setAttribute("data-aos", reducedMotion ? "none" : alternate ? "fade-right" : "fade-left");
        alternate = !alternate;
    });

    // Video play/pause
    if(reducedMotion) video_main.pause();
    else video_main.play();
}

/** Updates parallax */
// function updateParallax() {
    
// }

// Event listeners
//#region 
menu_button.addEventListener('click', toggleMenu);
backdrop.addEventListener('click', toggleMenu);
theme_button.addEventListener('click', switchTheme);

/** Enter acts as click */
document.addEventListener("keypress", event => {
    // if(document.activeElement.tagName == 'details') return;
    if(event.key === "Enter") document.activeElement.click();
});

/** On scroll */
window.onscroll = () => {
    // Nav bar
    let distance = document.documentElement.scrollTop || document.body.scrollTop;
    style(nav, 'nav_transparent', (distance == 0));
};

/** On resize */
window.onresize = () => { if(hamburger_open && window.innerWidth > mobile_layout_width) toggleMenu(); };

/** On load */
window.onload = event => {
    // Reduced motion
    let m = store('reducedMotion');
    const reduce_motion_preference = window.matchMedia(`(prefers-reduced-motion: reduce)`) === true || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;
    if(m == 'true' || m == null && reduce_motion_preference) toggleMotion();

    // Theme
    let t = store('theme');
    if(t == null || t == 'false') return;
    switchTheme(false);
};
//#endregion
