const deleteKeys = ['_links'];

const responsePathRewriteMap: Record<string, string> = {
  'https://yml.developer.infuse.myabsorb.com/api/rest/v2':
    'http://localhost:4000/v1/api/lms',
  'https://yml.developer.infuse.myabsorb.com/Files/Public':
    'http://localhost:4000/v1/api/lms/file/public',
  'https://yml.developer.infuse.myabsorb.com/Files/Private':
    'http://localhost:4000/v1/api/lms/file/private',
};

// use case
// 1 - delete all keys under delete keys
// 2 - check if embedded is present then replace that with result
// 3 - check if value is an url then replace with our backend url
// Method cleans up the LMS response sent
export const cleanUpResponse = (response: Record<string, unknown>) => {
  for (const key of Object.keys(response)) {
    if (deleteKeys.includes(key)) delete response[key];

    if (key === '_embedded') {
      response['result'] = response[key];
      delete response[key];
      if (
        typeof response['result'] === 'object' &&
        response['result'] &&
        Object.keys(response['result']).length > 0
      ) {
        Object.keys(response['result']).forEach((key) => {
          const arr = (
            response['result'] as Record<string, Record<string, unknown>[]>
          )[key];
          if (Array.isArray(arr)) {
            arr.forEach((obj) => (obj = cleanUpResponse(obj)));
          }
        });
      }
    }

    if (typeof response[key] === 'string') {
      Object.keys(responsePathRewriteMap).forEach((pKey) => {
        response[key] = (response[key] as string)
          .split(pKey)
          .join(responsePathRewriteMap[pKey]);
      });
    }
  }
  return response;
};
