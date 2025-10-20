/**
 * Utility for handling navbar hide/show behavior on scroll
 * Hides the navbar when scrolling down and shows it when scrolling up
 */

let lastScrollTop = 0;
let ticking = false;

/**
 * Handles the scroll event and toggles navbar visibility
 */
function handleScroll() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const navbar = document.querySelector('.nav') as HTMLElement;
  
  console.log('Scroll detected:', scrollTop); // Debug log
  
  if (!navbar) {
    console.log('Navbar not found'); // Debug log
    return;
  }

  if (scrollTop > lastScrollTop && scrollTop > 50) {
    // Scrolling down and past 50px - hide navbar
    console.log('Hiding navbar'); // Debug log
    navbar.classList.add('nav-hidden');
  } else {
    // Scrolling up or at top - show navbar
    console.log('Showing navbar'); // Debug log
    navbar.classList.remove('nav-hidden');
  }
  
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
}

/**
 * Direct scroll handler without throttling for testing
 */
function onScrollDirect() {
  handleScroll();
}

/**
 * Initialize navbar scroll behavior
 * Call this function when the component mounts
 */
export function initNavbarScroll() {
  console.log('Initializing navbar scroll'); // Debug log
  console.log('Is login page:', document.body.classList.contains('login-page')); // Debug log
  
  // Add scroll listener for all pages (for testing)
  window.addEventListener('scroll', onScrollDirect, { passive: true });
  
  // Also try listening on document
  document.addEventListener('scroll', onScrollDirect, { passive: true });
}

/**
 * Cleanup navbar scroll behavior
 * Call this function when the component unmounts
 */
export function cleanupNavbarScroll() {
  window.removeEventListener('scroll', onScrollDirect);
  document.removeEventListener('scroll', onScrollDirect);
  
  // Reset navbar visibility
  const navbar = document.querySelector('.nav') as HTMLElement;
  if (navbar) {
    navbar.classList.remove('nav-hidden');
  }
}

/**
 * Reset navbar scroll state
 * Useful when navigating between pages
 */
export function resetNavbarScroll() {
  lastScrollTop = 0;
  const navbar = document.querySelector('.nav') as HTMLElement;
  if (navbar) {
    navbar.classList.remove('nav-hidden');
  }
}