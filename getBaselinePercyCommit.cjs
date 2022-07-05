'use strict';
const fetch = require('node-fetch');

(async function main() {
  const { PERCY_PROJECT_ID, PERCY_TOKEN } = process.env;

  if (!PERCY_PROJECT_ID) {
    process.stderr.write('Missing PERCY_PROJECT_ID');
    process.exit(1);
  }

  if (!PERCY_TOKEN) {
    process.stderr.write('Missing PERCY_TOKEN');
    process.exit(1);
  }

  const builds = await fetch(
    `https://percy.io/api/v1/builds?project_id=${encodeURIComponent(PERCY_PROJECT_ID)}&page[limit]=20`,
    { headers: { Authorization: `Token ${PERCY_TOKEN}` } },
  )
    .then((res) => {
      if(res.ok) {
        return res.json()
      }
    })
    .catch(() => {
      process.stderr.write(
        `Error fetching builds for project id: ${PERCY_PROJECT_ID}`,
      );
      process.exit(1);
    });

  for (const build of builds.data) {
    if (!build.attributes && !build.attributes['review-state']) {
      process.stderr.write(
        `Missing attributes from build for build: ${build.id}`,
      );
      process.exit(1);
    }

    if(!build.attributes['commit-html-url']) {
      continue;
    }

    if (build.attributes['review-state'] === 'approved') {
      // eslint-disable-next-line no-await-in-loop
      const res = await fetch(
        `https://percy.io/api/v1/builds/${build.id}/removed-snapshots`,
        {
          headers: { Authorization: `Token ${process.env.PERCY_TOKEN}` },
        },
      ).catch(() => {
        process.stderr.write(
          `Error fetching revmoved-snapshots for build ${build.id}`,
        );
        process.exit(1);
      });

      // eslint-disable-next-line no-await-in-loop
      const removedSnapshot = await res.json();

      if (removedSnapshot.data.length === 0) {
        const gitSha = build.attributes['commit-html-url']
          .split('commit/')
          .pop();

        process.stdout.write(gitSha);
        process.exit();
      }
    }
  }
})();
