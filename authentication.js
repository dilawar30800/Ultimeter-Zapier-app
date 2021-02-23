'use strict';

// You want to make a request to an endpoint that is either specifically designed
// to test auth, or one that every user will have access to. eg: `/me`.
// By returning the entire request object, you have access to the request and
// response data for testing purposes. Your connection label can access any data
// from the returned response using the `json.` prefix. eg: `{{json.username}}`.
const test = (z, bundle) =>
    z.request({
        url: `${bundle.authData.url}/wp-json/ultimeter/v1/ultimeters/`,
    });

// This function runs after every outbound request. You can use it to check for
// errors or modify the response. You can have as many as you need. They'll need
// to each be registered in your index.js file.
const handleBadResponses = (response, z, bundle) => {
    if (response.status === 401) {
        throw new z.errors.Error(
            // This message is surfaced to the user
            'The API Key you supplied is incorrect',
            'AuthenticationError',
            response.status
        );
    }

    return response;
};

// This function runs before every outbound request. You can have as many as you
// need. They'll need to each be registered in your index.js file.
const includeApiKey = (request, z, bundle) => {
    request.headers['X-URL'] = bundle.authData.url;
    const basicHash = Buffer.from(`${bundle.authData.user}:${bundle.authData.password}`).toString(
        'base64'
    );
    request.headers.Authorization = `Basic ${basicHash}`;
    return request;
};

module.exports = {
    config: {
        // "custom" is the catch-all auth type. The user supplies some info and Zapier can
        // make authenticated requests with it
        type: 'custom',

        // Define any input app's auth requires here. The user will be prompted to enter
        // this info when they connect their account.
        fields: [
            {
                computed: false,
                key: 'url',
                required: true,
                label: 'Base URL',
                helpText: 'Enter your full publicly accessible WordPress URL (with leading http:// or https://). Do not include `/wp-admin/` or `wp-login.php`.\n' +
                    '\n' +
                    'If your WordPress site has a custom Login URL, please do not include the custom URL value. For example: use `https://example.com` instead of `https://example.com/login` as your Base URL value.'
            },
            {
                computed: false,
                key: 'user',
                required: true,
                label: 'Username',
                helpText: 'The username or email you use to login. If one does not work, try the other.'
            },
            {
                computed: false,
                key: 'password',
                required: true,
                label: 'Application Password',
                type: 'password',
                helpText: 'If you have a recent version of WordPress (from v5.6) you can create an application password by going to [this page](https://example.com/wp-admin/authorize-application.php), changing the `https://example.com` address to your own website URL. Alternatively, you can find a generator in your admin profile page.\n' +
                    '\n' +
                    'Once you have created an application password, enter it here.\n' +
                    '\n' +
                    'If you have not updated your WordPress version in a while (we recommend you always stay up-to-date), you can generate application passwords using [this plugin](https://wordpress.org/plugins/application-passwords/).'
            },
        ],

        // The test method allows Zapier to verify that the credentials a user provides
        // are valid. We'll execute this method whenever a user connects their account for
        // the first time.
        test,

        // This template string can access all the data returned from the auth test. If
        // you return the test object, you'll access the returned data with a label like
        // `{{json.X}}`. If you return `response.data` from your test, then your label can
        // be `{{X}}`. This can also be a function that returns a label. That function has
        // the standard args `(z, bundle)` and data returned from the test can be accessed
        // in `bundle.inputData.X`.
        connectionLabel: '{{bundle.authData.user}}',
    },
    befores: [includeApiKey],
    afters: [handleBadResponses],
};
