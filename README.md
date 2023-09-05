# coveo-atomic-custom

## prerequisites

Install yarn globally
`npm install --global yarn`

install lerna cli globally
install concurrently globally
`npm install --global lerna-cli concurrently`

## build

npm install
npm run build

## to publish

git config credential.username "ksuamel"
git login https://github.com/ksuamel/coveo-atomic-custom.git/

lerna publish

or

lerna changed --force-publish && lerna publish --force-publish
