// Custom reporter that filters out browser console messages
import {
  Reporter,
  TestCase,
  TestResult,
  FullResult,
} from '@playwright/test/reporter';

class FilterReporter implements Reporter {
  private filterBrowserLogs: boolean;

  constructor() {
    this.filterBrowserLogs = process.env.E2E_VERBOSE_LOGS === 'false';
  }

  onBegin() {
    // Test run started
  }

  onTestBegin(test: TestCase) {
    // Individual test started
  }

  onTestEnd(test: TestCase, result: TestResult) {
    // Filter console output if needed
    if (result.stdout && this.filterBrowserLogs) {
      // Convert stdout to string and filter out browser messages
      let stdoutString = '';
      if (Array.isArray(result.stdout)) {
        stdoutString = result.stdout
          .map((item) => (typeof item === 'string' ? item : String(item)))
          .join('\n');
      } else {
        stdoutString = String(result.stdout);
      }

      const filtered = stdoutString
        .split('\n')
        .filter(
          (line: string) =>
            !line.includes('[BROWSER warning]') &&
            !line.includes('[BROWSER info]') &&
            !line.includes('[BROWSER debug]')
        )
        .join('\n');

      // Convert back to array format
      result.stdout = filtered.split('\n') as any;
    }
  }

  onEnd(result: FullResult) {
    // Test run ended
  }

  printsToStdio(): boolean {
    return false; // Don't print to stdio, let other reporters handle it
  }
}

export default FilterReporter;
