# coveo-atomic-custom

## prerequisites

Install yarn globally

install lerna cli globally
install concurrently globally

## build

npm install
npm run build

## to publish

git config credential.username "jcore"
git login https://github.com/jcore/coveo-atomic-custom.git/

lerna publish

or

lerna changed --force-publish && lerna publish --force-publish
