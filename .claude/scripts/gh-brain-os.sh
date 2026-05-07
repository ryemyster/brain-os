#!/usr/bin/env bash
# gh wrapper that auto-switches between ryemyster and ascendvent accounts
# based on the --repo flag or current directory's git remote.
# Usage: gh-brain-os.sh <gh args...>
# Examples:
#   gh-brain-os.sh issue list --repo ascendvent/checkin-ascendvent
#   gh-brain-os.sh issue list --repo ryemyster/brain-os-mcp

ASCENDVENT_ORGS=("ascendvent")

# Detect which account to use from --repo flag value or cwd remote
detect_account() {
  local repo_arg=""

  # Check for --repo flag in args
  for i in "$@"; do
    if [[ "$prev" == "--repo" || "$prev" == "-R" ]]; then
      repo_arg="$i"
      break
    fi
    prev="$i"
  done

  # Fall back to cwd git remote
  if [[ -z "$repo_arg" ]]; then
    repo_arg=$(git remote get-url origin 2>/dev/null | sed 's/.*github[^:]*:\([^/]*\)\/.*/\1/')
  fi

  local org="${repo_arg%%/*}"
  for ascendvent_org in "${ASCENDVENT_ORGS[@]}"; do
    if [[ "$org" == "$ascendvent_org" ]]; then
      echo "ascendvent"
      return
    fi
  done

  echo "ryemyster"
}

ACCOUNT=$(detect_account "$@")
gh auth switch --user "$ACCOUNT" 2>/dev/null
gh "$@"
EXIT_CODE=$?
# Always restore ryemyster as default after the call
gh auth switch --user ryemyster 2>/dev/null
exit $EXIT_CODE
