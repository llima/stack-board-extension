npm run build --prefix front
npm run build --prefix tasks/stack-board-repos

tfx extension create --manifest-globs vss-extension.json --overrides-file ./configs/release.json --root ./