<h1 align="center">Risk Realm</h1>
<p style="font-size: 17px" align="center">Fullstack gambling website application school project</p>

<p align="center">

<a align="center" href="https://riskrealm.7f454c46.xyz/">![Website](https://img.shields.io/website?url=https%3A%2F%2Friskrealm.7f454c46.xyz%2F&label=Production)
</a>
<a align="center" href="https://riskrealm.7f454c46.xyz/">
![Website](https://img.shields.io/website?url=https%3A%2F%2Fdev-riskrealm.7f454c46.xyz%2F&label=Development)
</a>
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/KoblizekXD/riskrealm/deploy.yml)

</p>

## About

Risk Realm is a fullstack gambling website application school project. It is a website where you can play games and bet money. The website is built with Next.js  and Supabase.

## Developers


<table>
<tr>
<td><img width=40 src="https://github.com/koblizekXD.png?size=40"></td>
<td><strong>AA55h</strong> - lead developer</td>
<td><strong>prokupekj.07@spst.eu</strong></td>
</tr>
<tr>
<td><img width=40 src="https://github.com/MalkiNcz.png?size=40"></td>
<td><strong>MalkiNcz</strong></td>
<td><strong>malekj.07@spst.eu</strong></td>
</tr>
<tr>
<td><img width=40 src="https://github.com/jarinjuan.png?size=40"></td>
<td><strong>Jarin Juan</strong></td>
<td><strong>rasovskyj.06@spst.eu</strong></td>
</tr>
</table>

## Technical information

The project uses the following setup:
<ul>
  <li>Next.js</li>
  <li>Supabase</li>
  <li>TailwindCSS</li>
  <li>Formerly used Auth.js</li>
</ul>

## Contributing

Commits to `dev` and `main` branches are both independently deployed.
On every weeks end, the `dev` branch is merged into `main` and deployed to the production environment. You can find the development deployement at
[dev-riskrealm.7f454c46.xyz](https://dev-riskrealm.7f454c46.xyz/).

You will need to have a Supabase instance up and running in order
to work on this project. You can create a new instance at [database.new](https://database.new/). After that, you will need to specify these following
environment variables:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

After that, you can just run the following command to start the project:

```bash
# npm
$ npm run dev
# yarn
$ yarn dev
# bun
$ bun run dev
```

## Licensing

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
