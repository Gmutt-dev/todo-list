git branch gh-pages
git checkout gh-pages && git merge main --no-edit
npx webpack --config webpack.prod.js
git add dist -f && git commit -m "Deployment commit"
git subtree push --prefix dist origin gh-pages
git checkout main