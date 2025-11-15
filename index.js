/**
 * Adds a searchbar to reporter to grep suites and tests.
 */

if (
  Cypress.config('isInteractive') &&
  window.top?.document.querySelectorAll('#test-suite-filter-search').length ===
    0
) {
  const style = document.createElement('style');
  style.textContent = `
  #test-suite-filter-search::-webkit-search-decoration,
  #test-suite-filter-search::-webkit-search-cancel-button,
  #test-suite-filter-search::-webkit-search-results-button,
  #test-suite-filter-search::-webkit-search-results-decoration {
    display: none;
  }
  #clear-test-suite-filter-search {
  background: inherit;
  color: #d0d2e0 !important;
}
  #test-suite-filter-search {
  background: inherit
}
`;

  const specContainer = window.top?.document.querySelector('.spec-container');
  const runnableHeader = window.top?.document.querySelector('.runnable-header');

  window.top?.document.head.appendChild(style);
  const parentEl = Cypress.version >= '15.0.0' ? specContainer : runnableHeader;

  parentEl.insertAdjacentHTML(
    'beforebegin',
    `
<div class="border-b border-gray-800 h-[64px] mx-[16px] auto-cols-max grid grid-flow-col gap-[8px] grid-cols-[minmax(0,1fr)] pointer-cursor items-center">
<div class="relative flex items-center w-full h-[48px]">

  <!-- 🔍 Search Icon (Left) -->
  <div class="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
    <svg
      id="search-icon-test-suite-filter"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="icon-dark-gray-800 icon-light-gray-1000"
      style="min-width: 16px; min-height: 16px;">
      <path
        d="M12 7C12 8.38071 11.4404 9.63071 10.5355 10.5355C9.63071 11.4404 8.38071 12 7 12C4.23858 12 2 9.76142 2 7C2 4.23858 4.23858 2 7 2C9.76142 2 12 4.23858 12 7Z"
        class="icon-light"
        fill="none" />
      <path
        d="M10.5355 10.5355L14 14M10.5355 10.5355C11.4404 9.63071 12 8.38071 12 7C12 4.23858 9.76142 2 7 2C4.23858 2 2 4.23858 2 7C2 9.76142 4.23858 12 7 12C8.38071 12 9.63071 11.4404 10.5355 10.5355Z"
        class="icon-dark"
        stroke="#1B1E2E"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round" />
    </svg>
  </div>

  <!-- 🏷 Label (Visually Hidden for a11y) -->
  <label
    for="test-suite-filter-search"
    class="cursor-text font-light bottom-[4px] left-[24px] text-gray-500 pointer-events-none absolute sr-only">
    Filter suites/tests
  </label>

  <!-- 🔤 Input -->
  <input
    id="test-suite-filter-search"
    type="search"
    aria-label="filter search for suites and tests"
    class="pl-8 pr-8 py-3 w-full font-bold text-lg outline-none bg-gray-1100 border-0 placeholder-gray-700 text-white-1500 rounded-md"
    placeholder="Filter suites/tests"
    autocapitalize="off"
    autocomplete="off"
    spellcheck="false"
  />

  <!-- ❌ Clear Button (Right) -->
  <button
    type="button"
    id="clear-test-suite-filter-search"
    aria-label="Clear search field"
    class="border-transparent rounded-md flex outline-none h-[30px] my-[4px] inset-y-0 right-0 w-[24px] duration-300 absolute items-center justify-center group hocus-default hocus:ring-0">
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="icon-light-gray-1000 group-hocus:icon-dark-indigo-300 icon-dark-gray-800"
      style="min-width: 16px; min-height: 16px;">
      <path
        d="M3 13L13 3M3 3L13 13"
        class="icon-dark"
        stroke="#1B1E2E"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round" />
    </svg>
  </button>

</div>
</div>  `
  );
}

const searchInput = window.top?.document.querySelector(
  '#test-suite-filter-search'
);
const clearBtn = window.top?.document.querySelector(
  '#clear-test-suite-filter-search'
);

searchInput?.addEventListener('focus', function () {
  window.top?.document
    .querySelector('#search-icon-test-suite-filter')
    .setAttribute('class', 'icon-dark-indigo-300 icon-light-grey-1700');
});

searchInput?.addEventListener('focusout', function () {
  window.top?.document
    .querySelector('#search-icon-test-suite-filter')
    .setAttribute('class', 'icon-dark-gray-800 icon-light-gray-1000');
});

clearBtn?.addEventListener('click', function () {
  searchInput.value = '';
  searchInput.focus();
  searchInput.dispatchEvent(new Event('input', { bubbles: true }));
});

searchInput?.addEventListener('input', (event) => {
  const searchTerm = event.target.value.toLowerCase();

  scanRunnables(searchTerm);
});

const scanRunnables = (searchTerm) => {
  const testRunnables = window.top?.document.querySelectorAll('.test.runnable');
  if (!testRunnables) return;

  // Split search groups by ";"
  const groups = searchTerm
    ?.toLowerCase()
    .split(';')
    .map((group) => group.replace(/,/g, ' ').split(/\s+/).filter(Boolean))
    .filter((group) => group.length > 0); // Remove empty groups

  for (let i = 0; i < testRunnables.length; i++) {
    const el = testRunnables[i];
    const itemText = el.textContent.toLowerCase();
    const suiteText = el
      .closest('.suite.runnable')
      ?.innerText.split('\n')[0]
      .toLowerCase();

    // A test matches if it satisfies ANY group
    const matchesAnyGroup = groups?.some((group) =>
      group.every((term) => {
        return itemText.includes(term) || suiteText.includes(term);
      })
    );

    if (searchTerm === '') {
      el.style.display = '';
    } else {
      el.style.display = matchesAnyGroup ? '' : 'none';
    }
  }
};

// Wrapping logic within isInteractive check
// This targets cypress open mode where user can switch specs
if (Cypress.config('isInteractive')) {
  Cypress.on('window:unload', () => {
    const searchInput = window.top?.document.querySelector(
      '#test-suite-filter-search'
    );
    const searchTerm = searchInput?.value.toLowerCase();
    // Store the current Cypress test runner url
    // This is to check against any spec change in test runner while a filter search is entered
    // If a user does switch spec while filter is active, the filter search will be reset
    const sidebarDebugLinkPage = window.top?.document.querySelector(
      '[data-cy="sidebar-link-debug-page"]'
    );
    if (
      window.top?.document.URL !=
        sidebarDebugLinkPage.getAttribute('data-url') &&
      searchInput?.value !== ''
    ) {
      clearBtn.click();
    }
    sidebarDebugLinkPage.setAttribute('data-url', window.top?.document.URL);

    scanRunnables(searchTerm);
  });
}

if (Cypress.config('isInteractive')) {
  // To account for when the collapsible runnables are removed, persist filtered runnables
  // watching for changes to DOM structure
  MutationObserver = window.MutationObserver;

  var observer = new MutationObserver(function () {
    const searchInput = window.top?.document.querySelector(
      '#test-suite-filter-search'
    );
    // fired when a mutation occurs
    scanRunnables(searchInput?.value);
  });

  // defining the window.top?.document to be observed by the observer
  observer.observe(window.top?.document, {
    subtree: true,
    attributes: true,
  });
}
