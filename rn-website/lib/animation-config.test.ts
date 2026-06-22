/**
 * Unit tests for animation configuration module
 * Validates configuration constants, utility functions, and accessibility support
 */

import {
  ANIMATION_CONFIG,
  getAnimationConfig,
  getPerformanceConfig,
  type QualityLevel,
  type AnimationConfigType,
} from './animation-config';

describe('Animation Configuration Module', () => {
  describe('ANIMATION_CONFIG constant', () => {
    it('should have all required duration properties', () => {
      expect(ANIMATION_CONFIG.duration).toHaveProperty('instant');
      expect(ANIMATION_CONFIG.duration).toHaveProperty('fast');
      expect(ANIMATION_CONFIG.duration).toHaveProperty('normal');
      expect(ANIMATION_CONFIG.duration).toHaveProperty('slow');
      expect(ANIMATION_CONFIG.duration).toHaveProperty('pageHero');
      expect(ANIMATION_CONFIG.duration).toHaveProperty('scrollReveal');
      expect(ANIMATION_CONFIG.duration).toHaveProperty('flipText');
    });

    it('should have correct duration values', () => {
      expect(ANIMATION_CONFIG.duration.instant).toBe(150);
      expect(ANIMATION_CONFIG.duration.fast).toBe(200);
      expect(ANIMATION_CONFIG.duration.normal).toBe(300);
      expect(ANIMATION_CONFIG.duration.slow).toBe(600);
      expect(ANIMATION_CONFIG.duration.pageHero).toBe(800);
      expect(ANIMATION_CONFIG.duration.scrollReveal).toBe(700);
      expect(ANIMATION_CONFIG.duration.flipText).toBe(2200);
    });

    it('should have all required spring presets', () => {
      expect(ANIMATION_CONFIG.spring).toHaveProperty('default');
      expect(ANIMATION_CONFIG.spring).toHaveProperty('responsive');
      expect(ANIMATION_CONFIG.spring).toHaveProperty('smooth');
      expect(ANIMATION_CONFIG.spring).toHaveProperty('bouncy');
    });

    it('should have correct spring configurations', () => {
      expect(ANIMATION_CONFIG.spring.default).toEqual({
        stiffness: 300,
        damping: 25,
      });
      expect(ANIMATION_CONFIG.spring.responsive).toEqual({
        stiffness: 300,
        damping: 24,
      });
      expect(ANIMATION_CONFIG.spring.bouncy).toEqual({
        stiffness: 500,
        damping: 30,
        mass: 0.5,
      });
    });

    it('should have correct easing functions', () => {
      expect(ANIMATION_CONFIG.easing.default).toBe('outExpo');
      expect(ANIMATION_CONFIG.easing.smooth).toBe('outCubic');
      expect(ANIMATION_CONFIG.easing.sharp).toBe('outQuad');
    });

    it('should have correct stagger delays', () => {
      expect(ANIMATION_CONFIG.stagger.tight).toBe(45);
      expect(ANIMATION_CONFIG.stagger.normal).toBe(80);
      expect(ANIMATION_CONFIG.stagger.loose).toBe(100);
    });

    it('should have correct model performance config', () => {
      expect(ANIMATION_CONFIG.model.rotationSpeed).toBe(0.3);
      expect(ANIMATION_CONFIG.model.dampingFactor).toBe(0.05);
      expect(ANIMATION_CONFIG.model.targetFPS).toEqual({
        desktop: 60,
        mobile: 30,
      });
    });
  });

  describe('getAnimationConfig', () => {
    it('should return standard config when no options provided', () => {
      const config = getAnimationConfig();
      expect(config).toEqual(ANIMATION_CONFIG);
    });

    it('should return standard config when respectMotionPreference is false', () => {
      const config = getAnimationConfig({ respectMotionPreference: false });
      expect(config).toEqual(ANIMATION_CONFIG);
    });

    it('should return config with reduced durations when prefers-reduced-motion is active', () => {
      // Store original matchMedia
      const originalMatchMedia = window.matchMedia;

      // Mock matchMedia to return prefers-reduced-motion: reduce
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      const config = getAnimationConfig({ respectMotionPreference: true });

      // Durations should be reduced by 50%
      expect(config.duration.instant).toBe(75);
      expect(config.duration.fast).toBe(100);
      expect(config.duration.normal).toBe(150);
      expect(config.duration.slow).toBe(300);
      expect(config.duration.pageHero).toBe(400);
      expect(config.duration.scrollReveal).toBe(350);
      expect(config.duration.flipText).toBe(1100);

      // Other properties should remain unchanged
      expect(config.spring).toEqual(ANIMATION_CONFIG.spring);
      expect(config.easing).toEqual(ANIMATION_CONFIG.easing);
      expect(config.stagger).toEqual(ANIMATION_CONFIG.stagger);
      expect(config.model).toEqual(ANIMATION_CONFIG.model);

      // Restore original matchMedia
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: originalMatchMedia,
      });
    });

    it('should handle missing window object gracefully (SSR)', () => {
      const originalWindow = global.window;
      
      // @ts-expect-error - Testing SSR scenario where window is undefined
      delete global.window;

      const config = getAnimationConfig({ respectMotionPreference: true });
      expect(config).toEqual(ANIMATION_CONFIG);

      // Restore original window
      global.window = originalWindow;
    });

    it('should handle window without matchMedia function (SSR/older browsers)', () => {
      const originalWindow = global.window;
      const originalMatchMedia = window.matchMedia;
      
      // @ts-expect-error - Testing browser without matchMedia support
      delete window.matchMedia;

      const config = getAnimationConfig({ respectMotionPreference: true });
      expect(config).toEqual(ANIMATION_CONFIG);

      // Restore original matchMedia
      window.matchMedia = originalMatchMedia;
      global.window = originalWindow;
    });

    it('should handle standard motion preference (not reduced)', () => {
      // Mock matchMedia to return prefers-reduced-motion: no-preference
      const originalMatchMedia = window.matchMedia;
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      const config = getAnimationConfig({ respectMotionPreference: true });
      expect(config).toEqual(ANIMATION_CONFIG);

      // Restore original matchMedia
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: originalMatchMedia,
      });
    });
  });

  describe('getPerformanceConfig', () => {
    it('should return correct config for high quality', () => {
      const config = getPerformanceConfig('high');
      expect(config).toEqual({
        enableComplexAnimations: true,
        targetFPS: 60,
      });
    });

    it('should return correct config for medium quality', () => {
      const config = getPerformanceConfig('medium');
      expect(config).toEqual({
        enableComplexAnimations: true,
        targetFPS: 30,
      });
    });

    it('should return correct config for low quality', () => {
      const config = getPerformanceConfig('low');
      expect(config).toEqual({
        enableComplexAnimations: false,
        targetFPS: 30,
      });
    });

    it('should handle all quality levels', () => {
      const qualityLevels: QualityLevel[] = ['high', 'medium', 'low'];
      qualityLevels.forEach((level) => {
        const config = getPerformanceConfig(level);
        expect(config).toHaveProperty('enableComplexAnimations');
        expect(config).toHaveProperty('targetFPS');
        expect(typeof config.enableComplexAnimations).toBe('boolean');
        expect(typeof config.targetFPS).toBe('number');
      });
    });
  });

  describe('Type safety', () => {
    it('should enforce correct types for ANIMATION_CONFIG', () => {
      const config: AnimationConfigType = ANIMATION_CONFIG;
      
      // This test passes if TypeScript compilation succeeds
      expect(config).toBeDefined();
    });

    it('should have frozen duration values (as const)', () => {
      // 'as const' makes the type readonly in TypeScript
      // At runtime, the values can still be modified unless Object.freeze is used
      // This test verifies the config structure is correct
      expect(ANIMATION_CONFIG.duration.instant).toBe(150);
      expect(typeof ANIMATION_CONFIG.duration).toBe('object');
      
      // Note: Runtime immutability would require Object.freeze()
      // Currently only TypeScript compile-time immutability is enforced via 'as const'
    });
  });

  describe('Configuration value ranges', () => {
    it('should have durations within reasonable ranges', () => {
      // All durations should be positive numbers
      expect(ANIMATION_CONFIG.duration.instant).toBeGreaterThan(0);
      expect(ANIMATION_CONFIG.duration.fast).toBeGreaterThan(0);
      expect(ANIMATION_CONFIG.duration.normal).toBeGreaterThan(0);
      expect(ANIMATION_CONFIG.duration.slow).toBeGreaterThan(0);
      expect(ANIMATION_CONFIG.duration.pageHero).toBeGreaterThan(0);
      expect(ANIMATION_CONFIG.duration.scrollReveal).toBeGreaterThan(0);
      expect(ANIMATION_CONFIG.duration.flipText).toBeGreaterThan(0);

      // Durations should follow logical ordering
      expect(ANIMATION_CONFIG.duration.instant).toBeLessThan(
        ANIMATION_CONFIG.duration.fast
      );
      expect(ANIMATION_CONFIG.duration.fast).toBeLessThan(
        ANIMATION_CONFIG.duration.normal
      );
      expect(ANIMATION_CONFIG.duration.normal).toBeLessThan(
        ANIMATION_CONFIG.duration.slow
      );
    });

    it('should have spring configurations with positive values', () => {
      Object.values(ANIMATION_CONFIG.spring).forEach((springConfig) => {
        expect(springConfig.stiffness).toBeGreaterThan(0);
        expect(springConfig.damping).toBeGreaterThan(0);
        if (springConfig.mass !== undefined) {
          expect(springConfig.mass).toBeGreaterThan(0);
        }
      });
    });

    it('should have stagger delays in ascending order', () => {
      expect(ANIMATION_CONFIG.stagger.tight).toBeLessThan(
        ANIMATION_CONFIG.stagger.normal
      );
      expect(ANIMATION_CONFIG.stagger.normal).toBeLessThan(
        ANIMATION_CONFIG.stagger.loose
      );
    });

    it('should have model performance config with reasonable values', () => {
      expect(ANIMATION_CONFIG.model.rotationSpeed).toBeGreaterThan(0);
      expect(ANIMATION_CONFIG.model.rotationSpeed).toBeLessThan(10); // Not spinning too fast
      expect(ANIMATION_CONFIG.model.dampingFactor).toBeGreaterThan(0);
      expect(ANIMATION_CONFIG.model.dampingFactor).toBeLessThan(1); // Valid damping range
      expect(ANIMATION_CONFIG.model.targetFPS.desktop).toBe(60);
      expect(ANIMATION_CONFIG.model.targetFPS.mobile).toBe(30);
      expect(ANIMATION_CONFIG.model.targetFPS.desktop).toBeGreaterThan(
        ANIMATION_CONFIG.model.targetFPS.mobile
      );
    });

    it('should have all duration values as numbers', () => {
      Object.values(ANIMATION_CONFIG.duration).forEach((duration) => {
        expect(typeof duration).toBe('number');
        expect(Number.isFinite(duration)).toBe(true);
      });
    });

    it('should have all easing values as strings', () => {
      Object.values(ANIMATION_CONFIG.easing).forEach((easing) => {
        expect(typeof easing).toBe('string');
        expect(easing.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Reduced motion calculations', () => {
    it('should reduce all durations by exactly 50%', () => {
      const originalMatchMedia = window.matchMedia;
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      const config = getAnimationConfig({ respectMotionPreference: true });

      expect(config.duration.instant).toBe(
        Math.round(ANIMATION_CONFIG.duration.instant * 0.5)
      );
      expect(config.duration.fast).toBe(
        Math.round(ANIMATION_CONFIG.duration.fast * 0.5)
      );
      expect(config.duration.normal).toBe(
        Math.round(ANIMATION_CONFIG.duration.normal * 0.5)
      );
      expect(config.duration.slow).toBe(
        Math.round(ANIMATION_CONFIG.duration.slow * 0.5)
      );
      expect(config.duration.pageHero).toBe(
        Math.round(ANIMATION_CONFIG.duration.pageHero * 0.5)
      );
      expect(config.duration.scrollReveal).toBe(
        Math.round(ANIMATION_CONFIG.duration.scrollReveal * 0.5)
      );
      expect(config.duration.flipText).toBe(
        Math.round(ANIMATION_CONFIG.duration.flipText * 0.5)
      );

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: originalMatchMedia,
      });
    });

    it('should not modify spring, easing, stagger, or model configs for reduced motion', () => {
      const originalMatchMedia = window.matchMedia;
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      const config = getAnimationConfig({ respectMotionPreference: true });

      expect(config.spring).toEqual(ANIMATION_CONFIG.spring);
      expect(config.easing).toEqual(ANIMATION_CONFIG.easing);
      expect(config.stagger).toEqual(ANIMATION_CONFIG.stagger);
      expect(config.model).toEqual(ANIMATION_CONFIG.model);

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: originalMatchMedia,
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle isDark parameter (future theme support)', () => {
      const configLight = getAnimationConfig({ isDark: false });
      const configDark = getAnimationConfig({ isDark: true });
      
      // Currently isDark doesn't affect config, but test the API
      expect(configLight).toEqual(ANIMATION_CONFIG);
      expect(configDark).toEqual(ANIMATION_CONFIG);
    });

    it('should handle empty options object', () => {
      const config = getAnimationConfig({});
      expect(config).toEqual(ANIMATION_CONFIG);
    });

    it('should handle multiple calls consistently', () => {
      const config1 = getAnimationConfig();
      const config2 = getAnimationConfig();
      const config3 = getAnimationConfig({ respectMotionPreference: false });
      
      expect(config1).toEqual(config2);
      expect(config2).toEqual(config3);
    });
  });
});
