# Branch Protection Configuration Guide

## Overview
This guide provides step-by-step instructions for configuring GitHub branch protection rules to enforce CI/CD quality gates on the Crypture repository.

## Purpose
Branch protection rules ensure that:
- All tests pass before code can be merged
- Code reviews are completed
- The main branch remains stable and deployable
- Team members follow consistent merge practices

## Configuration Steps

### 1. Access Branch Protection Settings
1. Navigate to the Crypture repository on GitHub
2. Click **Settings** (requires admin permissions)
3. In the left sidebar, click **Branches**
4. Click **Add rule** (or **Edit** if a rule already exists for `main`)

### 2. Configure Branch Name Pattern
- **Branch name pattern**: `main`
- This applies the rule specifically to the main branch

### 3. Required Status Checks

#### Enable Status Checks
✅ Check **Require status checks to pass before merging**

#### Select Required Checks
After the first workflow run, the following checks will be available to select:
- `Unit Tests (Vitest)`
- `E2E Tests (Playwright)`
- `Lint Code`

**Important**: You must run the workflow at least once before these checks appear in the list.

#### Additional Status Check Settings
✅ Check **Require branches to be up to date before merging**
- This ensures that tests run against the latest code from main
- Prevents integration issues from stale branches
- May require rebasing/merging main into feature branches before merging

### 4. Pull Request Requirements (Recommended)

✅ Check **Require a pull request before merging**
- **Required approvals**: Set to `1` (minimum recommended)
- ✅ **Dismiss stale pull request approvals when new commits are pushed**
- ✅ **Require review from Code Owners** (if CODEOWNERS file exists)

✅ Check **Require conversation resolution before merging**
- Ensures all review comments are addressed

### 5. Additional Protections (Recommended)

✅ Check **Require linear history**
- Enforces a clean, linear git history
- Prevents merge commits (requires rebase or squash merge)

✅ Check **Include administrators**
- Enforces rules for all users, including repository admins
- Prevents accidental rule bypasses

✅ Check **Do not allow bypassing the above settings**
- Removes the ability to force-push or bypass protections

### 6. Restrictions (Optional)

**Restrict who can push to matching branches**
- Leave unchecked for most teams
- Can be used to limit direct pushes to specific users/teams

### 7. Save Configuration
Click **Create** (or **Save changes**) at the bottom of the page

## Verification

### Test the Configuration
1. Create a test branch: `git checkout -b test/branch-protection`
2. Make a trivial change and commit
3. Push the branch and create a PR to `main`
4. Verify that:
   - CI workflow runs automatically
   - Status checks appear on the PR
   - Merge button is disabled until checks pass
   - Required approvals are enforced (if configured)

### Expected Behavior
- **All checks passing**: Merge button is green and enabled
- **Any check failing**: Merge button is disabled with message "Merging is blocked"
- **Checks pending**: Merge button shows "Merging is blocked" until checks complete

## Troubleshooting

### Status Checks Not Appearing

**Problem**: Required checks don't appear in the dropdown list

**Solution**:
1. Ensure the workflow has run at least once on the `main` branch
2. Push a commit to `main` to trigger the workflow
3. Wait for workflow to complete
4. Refresh the branch protection settings page
5. The checks should now appear in the searchable dropdown

### Cannot Merge Despite Passing Tests

**Problem**: Merge button disabled even with green checks

**Possible Causes**:
1. **Branch not up to date**: Merge or rebase with latest `main`
2. **Unresolved conversations**: Resolve all PR comments
3. **Missing approvals**: Request required reviews
4. **Different check names**: Verify check names match exactly

**Solution**: Check the PR status section for specific blocking reasons

### Administrators Can Still Bypass

**Problem**: Admins can merge without passing checks

**Solution**:
1. Edit branch protection rule
2. ✅ Check **Include administrators**
3. ✅ Check **Do not allow bypassing the above settings**
4. Save changes

### Checks Running on Wrong Branch

**Problem**: Workflow runs on feature branches but not on PRs to main

**Solution**:
1. Verify workflow trigger configuration in `.github/workflows/ci.yml`
2. Ensure `pull_request` trigger includes `main` branch
3. Check that PR is targeting the correct base branch

## Maintenance

### Updating Required Checks
When adding or renaming workflow jobs:
1. Update the workflow file
2. Run the workflow at least once
3. Update branch protection rules to include new check names
4. Remove old check names if jobs were renamed

### Temporary Bypass (Emergency Only)
If you must bypass protections in an emergency:
1. Requires admin permissions
2. Edit branch protection rule
3. Temporarily disable specific requirements
4. **Important**: Re-enable protections immediately after emergency merge
5. Document the bypass in PR comments and team chat

## Best Practices

### For Developers
1. **Run tests locally** before pushing to save CI time
2. **Keep branches up to date** with main to avoid last-minute conflicts
3. **Address review comments promptly** to unblock merging
4. **Monitor CI failures** and fix them quickly

### For Team Leads
1. **Review branch protection settings** quarterly
2. **Update required checks** when workflow changes
3. **Enforce approval requirements** based on team size and risk
4. **Document exceptions** when protections are bypassed

### For Repository Admins
1. **Enable "Include administrators"** to lead by example
2. **Audit bypass events** regularly (Settings → Branches → Rule insights)
3. **Communicate changes** to branch protection rules with the team
4. **Test new rules** on a test repository first if making major changes

## Related Documentation
- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [CI/CD Setup Documentation](./ci-cd-setup.md)
- [Frontend README - CI/CD Section](../frontend/README.md)

## Summary Checklist

Use this checklist when configuring branch protection:

- [ ] Navigate to Settings → Branches
- [ ] Add/edit rule for `main` branch
- [ ] ✅ Require status checks to pass before merging
  - [ ] Select: `Unit Tests (Vitest)`
  - [ ] Select: `E2E Tests (Playwright)`
  - [ ] Select: `Lint Code`
- [ ] ✅ Require branches to be up to date before merging
- [ ] ✅ Require a pull request before merging (1 approval minimum)
- [ ] ✅ Require conversation resolution before merging
- [ ] ✅ Include administrators
- [ ] ✅ Do not allow bypassing the above settings
- [ ] Save changes
- [ ] Test with a sample PR
- [ ] Document configuration in team wiki/docs
