#!/bin/sh
# Build the Pagefind search index over the built post pages.
# Pagefind refuses to run when it matches zero files, which is the case until
# the blog has at least one post — so guard the empty state instead of failing.
set -e

if ls dist/posts/*/index.html >/dev/null 2>&1; then
  exec pagefind --site dist --glob 'posts/*/index.html'
else
  echo "pagefind: no posts found, skipping search index build"
fi
