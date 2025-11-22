import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useNotifications } from '@hooks/useNotifications.tsx';
import toast from 'react-hot-toast';

// Mock react-hot-toast
vi.mock('react-hot-toast', () => {
  const mockCustom = vi.fn();
  const mockToast = vi.fn();
  mockToast.custom = mockCustom;
  return {
    default: mockToast,
  };
});

// Mock toast components
vi.mock('@components/Toast/SuccessToast', () => ({
  SuccessToast: () => null,
}));
vi.mock('@components/Toast/ErrorToast', () => ({
  ErrorToast: () => null,
}));
vi.mock('@components/Toast/WarningToast', () => ({
  WarningToast: () => null,
}));

describe('useNotifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('success notifications', () => {
    it('calls toast.custom with success message and default duration', () => {
      const { result } = renderHook(() => useNotifications());

      result.current.success('Test success message');

      expect(toast.custom).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          duration: 4000,
          ariaProps: expect.objectContaining({
            role: 'status',
            'aria-live': 'polite',
          }),
        })
      );
    });

    it('applies custom duration when provided', () => {
      const { result } = renderHook(() => useNotifications());

      result.current.success('Custom duration', { duration: 5000 });

      expect(toast.custom).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          duration: 5000,
        })
      );
    });




  });

  describe('error notifications', () => {
    it('calls toast.custom with error message and longer duration', () => {
      const { result } = renderHook(() => useNotifications());

      result.current.error('Test error message');

      expect(toast.custom).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          duration: 8000,
          ariaProps: expect.objectContaining({
            role: 'alert',
            'aria-live': 'assertive',
          }),
        })
      );
    });

    it('applies custom duration for errors', () => {
      const { result } = renderHook(() => useNotifications());

      result.current.error('Error', { duration: 10000 });

      expect(toast.custom).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          duration: 10000,
        })
      );
    });

    it('uses assertive aria-live for errors', () => {
      const { result } = renderHook(() => useNotifications());

      result.current.error('Critical error');

      expect(toast.custom).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          ariaProps: expect.objectContaining({
            'aria-live': 'assertive',
          }),
        })
      );
    });
  });

  describe('warning notifications', () => {
    it('calls toast.custom with warning message and medium duration', () => {
      const { result } = renderHook(() => useNotifications());

      result.current.warning('Test warning message');

      expect(toast.custom).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          duration: 6000,
          ariaProps: expect.objectContaining({
            role: 'status',
            'aria-live': 'polite',
          }),
        })
      );
    });

    it('applies custom duration for warnings', () => {
      const { result } = renderHook(() => useNotifications());

      result.current.warning('Warning', { duration: 7000 });

      expect(toast.custom).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          duration: 7000,
        })
      );
    });
  });

  describe('info notifications', () => {
    it('calls toast with info message and default duration', () => {
      const { result } = renderHook(() => useNotifications());
      const message = 'Info message';

      result.current.info(message);

      expect(toast).toHaveBeenCalledWith(
        message,
        expect.objectContaining({
          duration: 4000,
          ariaProps: expect.objectContaining({
            role: 'status',
            'aria-live': 'polite',
          }),
        })
      );
    });
  });

  describe('custom icons', () => {
    it('passes custom icon to toast component', () => {
      const { result } = renderHook(() => useNotifications());

      result.current.success('Message', { icon: '🎉' });

      // Verify toast.custom was called (icon is passed to component via render function)
      expect(toast.custom).toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('all notifications include proper ARIA attributes', () => {
      const { result } = renderHook(() => useNotifications());

      result.current.success('Success');
      result.current.error('Error');
      result.current.warning('Warning');
      result.current.info('Info');

      // Verify all calls include ariaProps
      const calls = (toast.custom as ReturnType<typeof vi.fn>).mock.calls;
      calls.forEach((call) => {
        expect(call[1]).toHaveProperty('ariaProps');
        expect(call[1].ariaProps).toHaveProperty('role');
        expect(call[1].ariaProps).toHaveProperty('aria-live');
      });
    });
  });
});
