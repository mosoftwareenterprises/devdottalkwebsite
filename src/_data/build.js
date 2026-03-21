const commitSha = process.env.BUILD_COMMIT_SHA || process.env.GITHUB_SHA || '';
const repository = process.env.BUILD_REPOSITORY || process.env.GITHUB_REPOSITORY || '';
const branch = process.env.BUILD_BRANCH || process.env.GITHUB_REF_NAME || '';
const builtAtIso = process.env.BUILD_TIMESTAMP || new Date().toISOString();
const builtAtUtc = builtAtIso ? builtAtIso.replace('T', ' ').replace('Z', ' UTC') : '';
const currentYear = new Date().getUTCFullYear();

const shortSha = commitSha ? commitSha.slice(0, 7) : '';
const commitUrl = commitSha && repository
    ? `https://github.com/${repository}/commit/${commitSha}`
    : '';

export default {
    commitSha,
    shortSha,
    repository,
    commitUrl,
    branch,
    builtAtIso,
    builtAtUtc,
    currentYear
};