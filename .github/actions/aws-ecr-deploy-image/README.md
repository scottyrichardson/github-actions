# AWS ECR Deploy Image Action

Build and deploy Docker images to Amazon ECR.

## Usage

```yaml
- uses: ./.github/actions/aws-ecr-deploy-image
  with:
    repository: your-repo/image-name
    tags: latest,${{ github.sha }}
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: us-west-2
    dockerfile-path: .
```

## Inputs

| Name                    | Description                                       | Required | Default |
| ----------------------- | ------------------------------------------------- | -------- | ------- |
| `repository`            | Name of the ECR repository                        | Yes      | -       |
| `tags`                  | Comma-separated list of tags                      | Yes      | -       |
| `aws-access-key-id`     | AWS Access Key ID                                 | Yes      | -       |
| `aws-secret-access-key` | AWS Secret Access Key                             | Yes      | -       |
| `aws-region`            | AWS Region                                        | Yes      | -       |
| `dockerfile-path`       | Path to Dockerfile                                | No       | `.`     |
| `build-args`            | Build arguments (format: arg1=value1,arg2=value2) | No       | -       |

## Development

### Project Structure

```
.
├── action.yml     # Action metadata
├── src/          # Source code
│   └── index.js  # Main logic
├── package.json  # Dependencies
└── dist/         # Compiled code
    └── index.js
```

### Build Steps

1. Navigate to action directory:

```bash
cd .github/actions/aws-ecr-deploy-image
```

2. Install dependencies:

```bash
npm install
```

3. Install ncc:

```bash
npm i -g @vercel/ncc
```

4. Build the action:

```bash
ncc build src/index.js -o dist
```

5. Commit changes:

```bash
git add action.yml src/index.js package.json package-lock.json dist/index.js
git commit -m "Update action"
```

### Important Notes

- Always commit the `dist/index.js` file - it contains the compiled code and dependencies
- Always commit `package-lock.json` for dependency version consistency
- Don't commit `node_modules/`
- Update the dist build before committing changes to `src/index.js`
