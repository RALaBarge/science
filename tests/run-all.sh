#!/bin/sh
# Build, then run every test. Exit code is non-zero if anything fails.
cd "$(dirname "$0")/.." || exit 1
node build.mjs > /dev/null || exit 1
status=0
for t in gravity-duel gravity-modes laser-bounce short-circuit balance-duel phase-runner phase-bots football-duel hub; do
  echo "== $t"
  node "tests/$t.test.js" 2>/dev/null || node "tests/$t.js" 2>/dev/null
  [ $? -ne 0 ] && status=1
done
exit $status
