import authMiddleware from '@api/middleware/auth.middleware';
import { extractFromQuery, requestModels } from '@api/utils/request';
import { response } from '@api/utils/response';
import getSettings from '@application/settings/get-settings';
import listSettings from '@application/settings/list-settings';
import updateSettings from '@application/settings/update-settings';
import { settingsModels } from '@neat/types/settings';
import { Elysia } from 'elysia';

export default new Elysia()
  .model(requestModels)
  .model(settingsModels)
  .use(authMiddleware)
  .group('/settings', (app) =>
    app
      .get(
        '/',
        ({ query, auth }) =>
          response(listSettings({ auth, pag: extractFromQuery(query) })),
        { query: 'pagination', tags: ['Settings'] }
      )
      .get(
        '/:key',
        ({ params, auth }) => response(getSettings({ auth, key: params.key })),
        { params: 'settings.key', tags: ['Settings'] }
      )
      .put(
        '/:key',
        ({ params, body, auth }) =>
          response(updateSettings({ key: params.key, auth, body })),
        { body: 'settings.update', params: 'settings.key', tags: ['Settings'] }
      )
  );