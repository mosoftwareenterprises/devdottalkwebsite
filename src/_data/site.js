const siteUrl = process.env.SITE_URL || 'https://devdottalk.uk';

export default {
  url: siteUrl.replace(/\/$/, '')
};