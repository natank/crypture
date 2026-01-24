/**
 * NX CI Configuration Helper
 * Provides utilities for running NX commands in CI environments
 */

const { execSync } = require('child_process');

/**
 * Get list of affected projects
 * @param {string} target - The target to check (e.g., 'build', 'test', 'lint')
 * @returns {string[]} Array of affected project names
 */
function getAffectedProjects(target) {
  try {
    const output = execSync(
      `npx nx show projects --affected --withTarget=${target} --json`,
      { encoding: 'utf-8' }
    );
    return JSON.parse(output);
  } catch (error) {
    console.error('Error getting affected projects:', error.message);
    return [];
  }
}

/**
 * Run NX affected command with optimizations
 * @param {string} target - The target to run (e.g., 'build', 'test', 'lint')
 * @param {object} options - Additional options
 */
function runAffected(target, options = {}) {
  const {
    parallel = 3,
    configuration = 'ci',
    skipCache = false,
    verbose = false
  } = options;

  const args = [
    'npx nx affected',
    `-t ${target}`,
    `--parallel=${parallel}`,
    configuration ? `--configuration=${configuration}` : '',
    skipCache ? '--skip-nx-cache' : '',
    verbose ? '--verbose' : ''
  ].filter(Boolean).join(' ');

  console.log(`Running: ${args}`);
  
  try {
    execSync(args, { stdio: 'inherit' });
    console.log(`✅ Successfully ran ${target} for affected projects`);
  } catch (error) {
    console.error(`❌ Failed to run ${target}:`, error.message);
    process.exit(1);
  }
}

/**
 * Check if a specific project is affected
 * @param {string} projectName - Name of the project to check
 * @returns {boolean} True if project is affected
 */
function isProjectAffected(projectName) {
  try {
    execSync(
      `npx nx show project ${projectName} --affected`,
      { encoding: 'utf-8', stdio: 'pipe' }
    );
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get NX Cloud status
 * @returns {object} Cloud status information
 */
function getNxCloudStatus() {
  try {
    const output = execSync('npx nx-cloud status', { encoding: 'utf-8' });
    return {
      enabled: output.includes('enabled'),
      connected: !output.includes('not connected')
    };
  } catch (error) {
    return {
      enabled: false,
      connected: false,
      error: error.message
    };
  }
}

/**
 * Print CI environment information
 */
function printCiInfo() {
  console.log('=== NX CI Environment ===');
  console.log(`Node Version: ${process.version}`);
  console.log(`NX Cloud ID: ${process.env.NX_CLOUD_ACCESS_TOKEN ? 'Set' : 'Not Set'}`);
  console.log(`CI Environment: ${process.env.CI || 'false'}`);
  console.log(`Branch: ${process.env.GITHUB_REF || 'unknown'}`);
  
  const cloudStatus = getNxCloudStatus();
  console.log(`NX Cloud: ${cloudStatus.enabled ? 'Enabled' : 'Disabled'}`);
  console.log(`NX Cloud Connected: ${cloudStatus.connected ? 'Yes' : 'No'}`);
  console.log('========================\n');
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'affected':
      const target = args[1];
      if (!target) {
        console.error('Usage: node nx.ci.js affected <target>');
        process.exit(1);
      }
      runAffected(target, {
        parallel: parseInt(args[2]) || 3,
        configuration: args[3] || 'ci'
      });
      break;

    case 'list-affected':
      const listTarget = args[1] || 'build';
      const projects = getAffectedProjects(listTarget);
      console.log(`Affected projects for ${listTarget}:`, projects);
      break;

    case 'check-project':
      const projectName = args[1];
      if (!projectName) {
        console.error('Usage: node nx.ci.js check-project <project-name>');
        process.exit(1);
      }
      const affected = isProjectAffected(projectName);
      console.log(`Project ${projectName} is ${affected ? 'affected' : 'not affected'}`);
      process.exit(affected ? 0 : 1);
      break;

    case 'info':
      printCiInfo();
      break;

    default:
      console.log('NX CI Helper Commands:');
      console.log('  affected <target> [parallel] [config]  - Run affected command');
      console.log('  list-affected [target]                 - List affected projects');
      console.log('  check-project <name>                   - Check if project is affected');
      console.log('  info                                   - Print CI environment info');
      break;
  }
}

module.exports = {
  getAffectedProjects,
  runAffected,
  isProjectAffected,
  getNxCloudStatus,
  printCiInfo
};
