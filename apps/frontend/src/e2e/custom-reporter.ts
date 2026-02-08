// Custom reporter that respects E2E_VERBOSE_LOGS environment variable
import {
  Reporter,
  TestCase,
  TestResult,
  FullResult,
} from '@playwright/test/reporter';

class CustomReporter implements Reporter {
  private verbose: boolean;

  constructor() {
    this.verbose = process.env.E2E_VERBOSE_LOGS !== 'false';
  }

  onBegin() {
    // Test run started
  }

  onTestBegin(test: TestCase) {
    // Individual test started
  }

  onTestEnd(test: TestCase, result: TestResult) {
    // Individual test ended - filter console output based on verbose setting
    if (result.stdout && !this.verbose) {
      // Filter out browser console messages when not in verbose mode
      const filteredOutput = result.stdout
        .map((item) => (typeof item === 'string' ? item : item.toString()))
        .join('\n')
        .split('\n')
        .filter(
          (line: string) =>
            !line.includes('[BROWSER warning]') &&
            !line.includes('[BROWSER info]') &&
            !line.includes('[BROWSER debug]')
        )
        .join('\n');

      result.stdout = filteredOutput.split('\n') as (
        | string
        | Buffer<ArrayBufferLike>
      )[];
    }
  }

  onEnd(result: FullResult) {
    // Test run ended
  }

  printsToStdio(): boolean {
    return true;
  }
}

export default CustomReporter;
