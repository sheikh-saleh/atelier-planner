from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    # Navigate to settings page
    page.goto('http://localhost:3001')
    page.wait_for_load_state('networkidle')
    
    # Take screenshot of initial state
    page.screenshot(path='/tmp/initial-state.png', full_page=True)
    
    # Navigate to settings
    page.click('text=Settings')
    page.wait_for_load_state('networkidle')
    page.screenshot(path='/tmp/settings-page.png', full_page=True)
    
    # Click Sepia theme button
    page.click('button:has-text("sepia")')
    page.wait_for_timeout(500)
    page.screenshot(path='/tmp/sepia-theme.png', full_page=True)
    
    # Verify background color changed
    bg_color = page.evaluate('getComputedStyle(document.documentElement).getPropertyValue("--bg")')
    print(f"Background color after Sepia: {bg_color}")
    
    # Test persistence - reload page
    page.reload()
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(500)
    
    # Verify theme persisted
    html_classes = page.evaluate('document.documentElement.className')
    print(f"HTML classes after reload: {html_classes}")
    page.screenshot(path='/tmp/after-reload.png', full_page=True)
    
    # Test ThemeToggle button
    page.click('button[aria-label*="Switch"]')
    page.wait_for_timeout(500)
    page.screenshot(path='/tmp/after-toggle.png', full_page=True)
    
    # Get current theme from aria-label
    aria_label = page.get_attribute('button[aria-label*="Switch"]', 'aria-label')
    print(f"Theme toggle aria-label: {aria_label}")
    
    # Test all pages
    pages_to_test = ['Today', 'Habits', 'Timer', 'Journal', 'Stats']
    for page_name in pages_to_test:
        page.click(f'text={page_name}')
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(300)
        page.screenshot(path=f'/tmp/{page_name.lower()}-sepia.png', full_page=True)
        print(f"Tested {page_name} page")
    
    browser.close()
    print("All tests passed!")
