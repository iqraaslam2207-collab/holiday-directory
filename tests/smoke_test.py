"""Smoke tests for Holiday Directory redesign."""
from playwright.sync_api import sync_playwright
import os
import sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL = 'http://localhost:8765/home.html'


def run_tests():
    errors = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1280, 'height': 800})

        page.goto(URL, wait_until='networkidle', timeout=30000)

        # Hero loads
        hero = page.locator('#hero-heading')
        if not hero.is_visible():
            errors.append('Hero heading not visible')
        if 'Stay like a local' not in hero.text_content():
            errors.append('Hero text incorrect')

        # Navbar exists
        if not page.locator('.navbar').is_visible():
            errors.append('Navbar not visible')

        # Mobile menu toggle exists
        page.set_viewport_size({'width': 375, 'height': 812})
        page.goto(URL, wait_until='networkidle')
        toggle = page.locator('.menu-toggle')
        if not toggle.is_visible():
            errors.append('Mobile menu toggle not visible on mobile')
        toggle.click()
        if not page.locator('.navbar.menu-open').is_visible():
            errors.append('Mobile menu did not open')

        # Desktop deal modal
        page.set_viewport_size({'width': 1280, 'height': 800})
        page.goto(URL, wait_until='networkidle')
        page.locator('.deal-card').first.click()
        modal = page.locator('.deal-modal')
        page.wait_for_timeout(500)
        if not modal.is_visible():
            errors.append('Deal modal did not open')
        page.locator('.deal-modal__close').click()
        page.wait_for_timeout(300)

        # Sign-in page
        page.goto('http://localhost:8765/sign-in.html', wait_until='networkidle')
        if not page.locator('.auth-card h1').is_visible():
            errors.append('Sign-in page did not load')
        page.locator('#email').fill('test@example.com')
        page.locator('#password').fill('short')
        page.locator('.auth-btn').click()
        page.wait_for_timeout(200)
        if not page.locator('.has-error').first.is_visible():
            errors.append('Sign-in validation did not show error')

        # Screenshots
        screenshots_dir = os.path.join(BASE, 'test-screenshots')
        os.makedirs(screenshots_dir, exist_ok=True)
        page.goto(URL, wait_until='networkidle')
        page.set_viewport_size({'width': 1280, 'height': 800})
        page.screenshot(path=os.path.join(screenshots_dir, 'desktop-home.png'), full_page=False)
        page.set_viewport_size({'width': 375, 'height': 812})
        page.screenshot(path=os.path.join(screenshots_dir, 'mobile-home.png'), full_page=False)

        browser.close()

    if errors:
        print('FAILED:')
        for e in errors:
            print(' -', e)
        sys.exit(1)
    else:
        print('All smoke tests passed.')
        print('Screenshots saved to test-screenshots/')


if __name__ == '__main__':
    run_tests()
