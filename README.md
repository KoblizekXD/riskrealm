<h1 align="center">Risk Realm</h1>
<p style="font-size: 17px" align="center">Fullstack gambling website application for school project</p>

<p>

  <a align="center" href="https://riskrealm.7f454c46.xyz/">![Website](https://img.shields.io/website?url=https%3A%2F%2Friskrealm.7f454c46.xyz%2F)</a>
  <img alt="GitHub Actions Workflow Status" src="https://img.shields.io/github/actions/workflow/status/KoblizekXD/riskrealm/deploy.yml">
</p>

## Contributing
You will need a postgres database in order to develop this project.
Then, you will need to specify the environment variables in a `.env` file in the root of the project with your database credentials:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/riskrealm-dev?schema=public"
PG_USER=postgres
PG_PASS=postgres
```
Don't forge to run the migrations:
```bash
npx prisma migrate dev
# if bun
bun run prisma migrate dev
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