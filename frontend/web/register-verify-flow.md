# Register flow

- create user success
	- user is_verify default false

- redirect Email verify page 
	- auto send verify email
		- link with token ('24h')
	- include resend button (after 1min enable)

- user login
	- if user is_verify = false,
	- not set session cookies
	- redirect to check your email page
		- not auto send verify email
		- resend button enable
    
- user verify email
	- update user is_verify = true
	- auto login, set session cookies, redirect to create organization
