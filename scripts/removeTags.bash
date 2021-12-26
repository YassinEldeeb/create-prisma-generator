# Delete local tags.
git tag -l | xargs git tag -d
# Fetch remote tags.
git fetch
# Delete remote tags.
git tag -l | xargs -n 1 git push --delete origin
# Delete local tasg.
git tag -l | xargs git tag -d