import { describe, it, expect } from 'vitest';
import {
  TOOLTIP_CONTENT,
  getTooltipContent,
  hasTooltipContent,
  type TooltipKey,
} from '../../../components/EducationalTooltip/TooltipContent';

describe('TooltipContent', () => {
  describe('TOOLTIP_CONTENT', () => {
    it('should contain all required tooltip keys', () => {
      const requiredKeys: TooltipKey[] = [
        'market_cap',
        'volume',
        'liquidity',
        'market_cap_rank',
        'circulating_supply',
        'total_supply',
        'max_supply',
        'ath',
        'atl',
        'price_change_24h',
        'price_change_7d',
        'price_change_30d',
        'category_defi',
        'category_layer1',
        'category_layer2',
        'category_nft',
        'category_gaming',
        'category_meme',
        'category_stablecoin',
        'category_exchange_token',
        'category_metaverse',
        'category_web3',
      ];

      requiredKeys.forEach((key) => {
        expect(TOOLTIP_CONTENT[key]).toBeDefined();
        expect(TOOLTIP_CONTENT[key].title).toBeTruthy();
        expect(TOOLTIP_CONTENT[key].description).toBeTruthy();
      });
    });

    it('should have valid content structure for all entries', () => {
      Object.values(TOOLTIP_CONTENT).forEach((content) => {
        expect(content).toHaveProperty('title');
        expect(content).toHaveProperty('description');
        expect(typeof content.title).toBe('string');
        expect(typeof content.description).toBe('string');
        expect(content.title.length).toBeGreaterThan(0);
        expect(content.description.length).toBeGreaterThan(0);
      });
    });

    it('should have example field when provided', () => {
      const contentWithExample = TOOLTIP_CONTENT.market_cap;
      expect(contentWithExample.example).toBeDefined();
      expect(typeof contentWithExample.example).toBe('string');
      expect(contentWithExample.example!.length).toBeGreaterThan(0);
    });
  });

  describe('getTooltipContent', () => {
    it('should return content for valid key', () => {
      const content = getTooltipContent('market_cap');
      expect(content).toBeDefined();
      expect(content.title).toBe('Market Cap');
      expect(content.description).toContain('total value');
    });

    it('should return content for all valid keys', () => {
      const keys: TooltipKey[] = [
        'market_cap',
        'volume',
        'circulating_supply',
        'ath',
        'category_defi',
      ];

      keys.forEach((key) => {
        const content = getTooltipContent(key);
        expect(content).toBeDefined();
        expect(content.title).toBeTruthy();
      });
    });
  });

  describe('hasTooltipContent', () => {
    it('should return true for valid tooltip keys', () => {
      expect(hasTooltipContent('market_cap')).toBe(true);
      expect(hasTooltipContent('volume')).toBe(true);
      expect(hasTooltipContent('category_defi')).toBe(true);
    });

    it('should return false for invalid keys', () => {
      expect(hasTooltipContent('invalid_key')).toBe(false);
      expect(hasTooltipContent('')).toBe(false);
      expect(hasTooltipContent('market')).toBe(false);
    });

    it('should act as a type guard', () => {
      const key: string = 'market_cap';
      if (hasTooltipContent(key)) {
        // TypeScript should know key is TooltipKey here
        const content = getTooltipContent(key);
        expect(content).toBeDefined();
      }
    });
  });
});

