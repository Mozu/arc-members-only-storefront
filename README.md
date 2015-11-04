# arc-members-only-storefront
### version 0.1.1

Arc.js action to make your entire store accessible only to logged-in users.

### Usage
Create a new application in your Mozu developer account. Note its application key.

Clone this repository:

```sh
git clone https://github.com/mozu/arc-members-only-storefront
```

Change into the new repo directory:

```sh
cd arc-members-only-storefront
```

Run the Yeoman generator for creating Mozu configuration to connect to your developer account:

```sh
yo mozu-app --config
```

*(If you don't have the `yo` utility, or this generator, installed, you can install both at once with `npm install -g yo generator-mozu-app`.)*

Fill out the prompts, including the developer application key you noted aboe.

Install dependencies:

```sh
npm install
```

Build and upload the distribution package:

```sh
grunt
```

You'll need to enter your Mozu developer account password one more time for the first upload. *(You may have to install the Grunt command line utility: `npm install -g grunt-cli`

Now that your application is uploaded and synced with Developer Center, install it in a sandbox using the "Install" button on the application's Developer Center homepage. It should begin working immediately.

You can disable it in Action Management in your Settings menu.

![members only](http://i.imgur.com/UTbfDwc.jpg)
