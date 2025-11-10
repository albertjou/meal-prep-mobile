# GitHub Actions Workflows

## CI/CD Workflow

The `ci-cd.yml` workflow runs on every push and pull request to `main`/`master` branches.

### Checks Job

Runs the following checks:
1. **Linting** - Runs `npm run lint` using Expo's ESLint configuration
2. **Type Checking** - Runs TypeScript compiler in check mode
3. **Tests** - Currently skipped (commented out in workflow)

### Publish Job

If all checks pass and the push is to `main`/`master`, the workflow will:
1. Publish an update to Expo.dev using EAS Update
2. Update the `main` branch channel

## Setup

### Required GitHub Secret

You need to add an `EXPO_TOKEN` secret to your GitHub repository:

1. Go to your Expo account: https://expo.dev/accounts/[your-account]/settings/access-tokens
2. Create a new access token (or use an existing one)
3. Go to your GitHub repository → Settings → Secrets and variables → Actions
4. Click "New repository secret"
5. Name: `EXPO_TOKEN`
6. Value: Paste your Expo access token
7. Click "Add secret"

### EAS CLI

The workflow uses `npx eas-cli` which will be installed automatically. No need to add it as a dependency.

### EAS Configuration

The `eas.json` file in the root directory configures EAS Build and Update channels. The workflow publishes to the `main` channel by default.

## Customization

### Change Update Channel

To publish to a different channel, modify the `Publish to Expo.dev` step in `.github/workflows/ci-cd.yml`:

```yaml
npx eas-cli update --branch <your-branch-name> --channel <your-channel> --message "Update from GitHub Actions - ${{ github.sha }}"
```

### Skip Publishing on Certain Commits

Add a condition to the publish job:

```yaml
if: github.event_name == 'push' && !contains(github.event.head_commit.message, '[skip ci]')
```

### Add More Checks

Add additional steps to the `checks` job, such as:
- Build verification
- Bundle size checks
- Security audits

## Troubleshooting

### Workflow Fails on Publish

- Verify `EXPO_TOKEN` secret is set correctly
- Check that your Expo account has access to the project
- Ensure `eas.json` is properly configured
- Check EAS CLI logs in the GitHub Actions output

### Tests Fail

- Tests are currently skipped in the workflow
- To re-enable tests, uncomment the test step in `ci-cd.yml`
- Ensure all tests pass locally: `npm test`
- Check that test environment variables are set if needed
- Verify Jest configuration is correct

### Type Check Fails

- Run locally: `npx tsc --noEmit --skipLibCheck`
- Fix any TypeScript errors
- Ensure `tsconfig.json` is properly configured
