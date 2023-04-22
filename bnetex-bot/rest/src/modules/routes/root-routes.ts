import { readdirSync } from 'fs';

import path from 'path';

import url from 'url';

export async function routeInitizlization(rootPath: any, app: any) {
  {
    rootPath = path.normalize(`${import.meta.url.replace('file:///', '')}/../../../${rootPath}`);

    for (let i = 0; i < actions.getDirectories(rootPath).length; i++) {
      const ComponentDir = actions.getDirectories(rootPath)[i];

      const ComponentFiles = actions.getFiles([rootPath, ComponentDir]);

      const Router = ComponentFiles.filter((i: any) => i.name.includes('routes'));

      if (Router.length == 0) continue;

      const routerPath = `/${Router[0].name.split('.')[0]}`;
      import(url.pathToFileURL(`${rootPath}\/${ComponentDir}\/${Router[0].name}`).href).then((result) => {
        app.use(routerPath, result.default);
      });
    }
  }
}

const actions = {
  getFiles: function (source: any[] = []) {
    const path = source.map((i, index) => (index == source.length - 1 ? `${i}` : `${i}//`)).join('');
    return readdirSync(path, { withFileTypes: true });
  },
  getDirectories: function (source: any) {
    return readdirSync(source, { withFileTypes: true })
      .filter((dirent: any) => dirent.isDirectory())
      .map((dirent: any) => dirent.name);
  },
};
